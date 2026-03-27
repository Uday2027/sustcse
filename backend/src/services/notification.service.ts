import { supabaseAdmin } from '../config/supabase';
import { logger } from '../utils/logger';

/**
 * Creates a notification for a specific user.
 */
export const createNotification = async (
  userId: string,
  applicationId: string | null,
  message: string
): Promise<void> => {
  try {
    const { error } = await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      application_id: applicationId,
      message,
    });

    if (error) throw error;
  } catch (error) {
    logger.error('Failed to create notification', { userId, applicationId, error });
  }
};

/**
 * Notifies the student about an update to their application.
 */
export const notifyStudent = async (applicationId: string, message: string): Promise<void> => {
  try {
    const { data: app } = await supabaseAdmin
      .from('applications')
      .select('student_id')
      .eq('id', applicationId)
      .single();

    if (app) {
      await createNotification(app.student_id, applicationId, message);
    }
  } catch (error) {
    logger.error('Failed to notify student', { applicationId, error });
  }
};

/**
 * Notifies all admins about a new application or critical update.
 */
export const notifyAdmins = async (message: string): Promise<void> => {
  try {
    const { data: admins } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('role', 'admin');

    if (admins) {
      await Promise.all(admins.map((admin) => createNotification(admin.id, null, message)));
    }
  } catch (error) {
    logger.error('Failed to notify admins', { error });
  }
};

/**
 * Notifies a specific teacher (approver) about a pending task.
 */
export const notifyTeacher = async (
  teacherId: string,
  applicationId: string,
  message: string
): Promise<void> => {
  await createNotification(teacherId, applicationId, message);
};
