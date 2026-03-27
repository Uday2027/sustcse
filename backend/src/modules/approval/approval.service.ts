import { supabaseAdmin } from '../../config/supabase';
import { createError } from '../../middleware/errorHandler';
import * as pdfService from '../../services/pdf.service';
import * as cloudinaryService from '../../services/cloudinary.service';
import * as notificationService from '../../services/notification.service';
import { logger } from '../../utils/logger';

/**
 * Admin reviews an application and assigns an approval chain.
 */
export const adminReview = async (
  applicationId: string,
  adminId: string,
  status: 'approved' | 'rejected',
  comment: string,
  approverChain: { approver_id: string; step_order: number }[]
) => {
  try {
    if (status === 'rejected') {
      await supabaseAdmin.from('applications').update({ status: 'rejected' }).eq('id', applicationId);
      await supabaseAdmin.from('admin_reviews').insert({
        application_id: applicationId, admin_id: adminId, status: 'rejected', comment
      });
      await notificationService.notifyStudent(applicationId, `Your application was rejected by Admin. Reason: ${comment}`);
      return { message: 'Application rejected' };
    }

    // Approved by admin — set up the chain
    const steps = approverChain.map(step => ({
      application_id: applicationId,
      approver_id: step.approver_id,
      step_order: step.step_order,
      status: 'pending'
    }));

    await supabaseAdmin.from('approval_steps').insert(steps);
    await supabaseAdmin.from('applications').update({ status: 'under_review' }).eq('id', applicationId);
    await supabaseAdmin.from('admin_reviews').insert({
      application_id: applicationId, admin_id: adminId, status: 'approved', comment
    });

    // Notify first approver in chain
    const firstApprover = approverChain.find(s => s.step_order === 1);
    if (firstApprover) {
      await notificationService.notifyTeacher(firstApprover.approver_id, applicationId, `A new application is waiting for your review.`);
    }

    return { message: 'Chain assigned, application forwarded' };
  } catch (error) {
    logger.error('Admin review failed', { applicationId, error });
    throw createError(500, 'Failed to process admin review');
  }
};

/**
 * Teacher approves an application step, signs the PDF, and forwards to the next.
 */
export const approveStep = async (
  applicationId: string,
  stepId: string,
  teacher: any,
  comment: string
) => {
  try {
    // 1. Verify step eligibility
    const { data: step, error: stepError } = await supabaseAdmin
      .from('approval_steps')
      .select('*, applications(*)')
      .eq('id', stepId)
      .eq('approver_id', teacher.id)
      .single();

    if (stepError || !step || step.status !== 'pending') {
      throw createError(400, 'Step not available for approval');
    }

    // 2. Enforce sequence: check if previous steps are approved
    const { data: priorSteps } = await supabaseAdmin
      .from('approval_steps')
      .select('status')
      .eq('application_id', applicationId)
      .lt('step_order', step.step_order);
    
    if (priorSteps && !priorSteps.every(s => s.status === 'approved')) {
      throw createError(400, 'Previous approval steps are still pending');
    }

    // 3. Get current PDF URL (use last signed PDF or original if first step)
    const { data: latestStep } = await supabaseAdmin
      .from('approval_steps')
      .select('signed_pdf_url')
      .eq('application_id', applicationId)
      .eq('status', 'approved')
      .order('step_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const currentPdfUrl = latestStep?.signed_pdf_url || step.applications.original_pdf_url;

    // 4. Stamp signature onto PDF
    if (!teacher.signature_url) {
      throw createError(400, 'You must upload a signature image before approving.');
    }

    const signedPdfBytes = await pdfService.stampPDFWithSignature({
      existingPdfUrl: currentPdfUrl,
      signerName: teacher.full_name,
      designation: teacher.designation,
      signatureImageUrl: teacher.signature_url,
      sealImageUrl: teacher.seal_url,
      comment,
      stepLabel: teacher.designation || 'Teacher',
      timestamp: new Date().toISOString(),
      stepNumber: step.step_order,
    });

    // 5. Upload new signed PDF to Cloudinary
    const uploadResult = await cloudinaryService.uploadPDF(
      signedPdfBytes,
      `applications/${applicationId}/steps`
    );

    // 6. Update step record
    await supabaseAdmin.from('approval_steps').update({
      status: 'approved', comment, signed_at: new Date(), signed_pdf_url: uploadResult.secure_url
    }).eq('id', stepId);

    // 7. Check if this is the last step
    const { data: allSteps } = await supabaseAdmin
      .from('approval_steps')
      .select('step_order')
      .eq('application_id', applicationId)
      .order('step_order', { ascending: false });

    const isLastStep = step.step_order === allSteps![0].step_order;

    if (isLastStep) {
      await supabaseAdmin.from('applications').update({
        status: 'approved', final_pdf_url: uploadResult.secure_url
      }).eq('id', applicationId);
      await notificationService.notifyStudent(applicationId, 'Your application has been fully approved!');
    } else {
      const nextStepOrder = step.step_order + 1;
      const { data: nextStep } = await supabaseAdmin
        .from('approval_steps')
        .select('approver_id')
        .eq('application_id', applicationId)
        .eq('step_order', nextStepOrder)
        .single();
      
      if (nextStep) {
        await notificationService.notifyTeacher(nextStep.approver_id, applicationId, 'A new application is waiting for your review.');
      }
    }

    return { success: true, signed_pdf_url: uploadResult.secure_url };
  } catch (error) {
    logger.error('Step approval failed', { applicationId, stepId, error });
    throw error;
  }
};

/**
 * Teacher rejects an application step.
 */
export const rejectStep = async (applicationId: string, stepId: string, teacherId: string, comment: string) => {
  try {
    const { error: stepError } = await supabaseAdmin
      .from('approval_steps')
      .update({ status: 'rejected', comment, signed_at: new Date() })
      .eq('id', stepId)
      .eq('approver_id', teacherId);
    
    if (stepError) throw stepError;

    await supabaseAdmin.from('applications').update({ status: 'rejected' }).eq('id', applicationId);
    await notificationService.notifyStudent(applicationId, `Your application was rejected at an approval step. Reason: ${comment}`);

    return { success: true };
  } catch (error) {
    logger.error('Step rejection failed', { applicationId, stepId, error });
    throw createError(500, 'Failed to reject application');
  }
};
