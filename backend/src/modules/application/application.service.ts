import { supabaseAdmin } from '../../config/supabase';
import { createError } from '../../middleware/errorHandler';
import * as cloudinaryService from '../../services/cloudinary.service';
import * as pdfService from '../../services/pdf.service';
import * as notificationService from '../../services/notification.service';
import { logger } from '../../utils/logger';

interface CreateApplicationData {
  title: string;       // Subject of the application
  to: string;          // Addressed to (e.g. "The Chairman, CSE")
  toTeacherId?: string;
  mediumTeacherId?: string;
  body: string;        // Main body text
  departmentName?: string;
}

/**
 * Generates a serial number like APP-2025-0042.
 */
const generateSerialNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const { count } = await supabaseAdmin
    .from('applications')
    .select('*', { count: 'exact', head: true });
  
  const sequence = String((count || 0) + 1).padStart(4, '0');
  return `APP-${year}-${sequence}`;
};

/**
 * Creates a new application: generates A4 PDF from form data, uploads to Cloudinary.
 */
export const createApplication = async (
  data: CreateApplicationData,
  student: { id: string; full_name: string; student_id?: string; session?: string },
  attachmentBuffers: { buffer: Buffer; originalname: string }[] = []
) => {
  const { title, to, toTeacherId, mediumTeacherId, body, departmentName } = data;

  try {
    // 1. Generate serial number
    const serialNumber = await generateSerialNumber();

    // 2. Generate official A4 application PDF
    const pdfBuffer = await pdfService.generateApplicationPDF({
      serialNumber,
      title,
      to,
      body,
      studentName: student.full_name,
      studentId: student.student_id,
      session: student.session,
      date: new Date().toISOString(),
      departmentName,
    });

    // 3. Upload initial PDF to Cloudinary
    const uploadResult = await cloudinaryService.uploadPDF(
      pdfBuffer,
      `applications/${student.id}`
    );

    // 4. Save application record
    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .insert({
        student_id: student.id,
        serial_number: serialNumber,
        title,
        description: to,   // Store "to" in description for backward compat
        form_data: { 
          to, 
          body, 
          departmentName, 
          to_teacher_id: toTeacherId, 
          medium_teacher_id: mediumTeacherId 
        },
        status: 'pending',
        original_pdf_url: uploadResult.secure_url,
      })
      .select()
      .single();

    if (error) throw error;

    // 5. Upload and save attachments
    if (attachmentBuffers.length > 0) {
      const attachmentInserts = [];
      for (const file of attachmentBuffers) {
        const attachResult = await cloudinaryService.uploadPDF(
          file.buffer,
          `applications/${student.id}/attachments`
        );
        attachmentInserts.push({
          application_id: application.id,
          file_url: attachResult.secure_url,
          file_name: file.originalname,
        });
      }

      await supabaseAdmin.from('application_attachments').insert(attachmentInserts);
    }

    // 6. Notify admins
    await notificationService.notifyAdmins(
      `New application submitted: "${title}" (${serialNumber}) by ${student.full_name}`
    );

    return application;
  } catch (error) {
    logger.error('Failed to create application', { studentId: student.id, error });
    throw createError(500, 'Failed to submit application');
  }
};

/**
 * Retrieves all applications filtered by user role.
 */
export const getApplications = async (role: string, userId: string) => {
  let query = supabaseAdmin
    .from('applications')
    .select('*, student:profiles(full_name, role)');

  if (role === 'student') {
    query = query.eq('student_id', userId);
  } else if (role === 'teacher') {
    const { data: steps } = await supabaseAdmin
      .from('approval_steps')
      .select('application_id')
      .eq('approver_id', userId);

    const appIds = steps?.map(s => s.application_id) || [];
    if (appIds.length === 0) return [];
    query = query.in('id', appIds);
  }
  // Admins see all (no extra filter)

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * Retrieves a single application with its approval chain and attachments.
 */
export const getApplicationById = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('applications')
    .select(`
      *,
      student:profiles(full_name, designation, role, student_id, session_id),
      approval_steps(
        *,
        approver:profiles(full_name, designation, role, signature_url, seal_url)
      ),
      admin_reviews(
        *,
        admin:profiles(full_name)
      ),
      application_attachments(id, file_url, file_name, created_at)
    `)
    .eq('id', id)
    .single();

  if (error) {
    logger.error('Supabase application fetch error', { error, id });
    throw createError(404, 'Application not found');
  }

  // Sort approval steps by order
  if (data.approval_steps) {
    data.approval_steps.sort((a: any, b: any) => a.step_order - b.step_order);
  }

  return data;
};
