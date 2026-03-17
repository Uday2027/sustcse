import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import { transporter } from '../config/email';
import { supabaseAdmin } from '../config/supabase';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { createError } from '../middleware/errorHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates', 'emails');

// Template cache to avoid re-reading files on every send
const templateCache = new Map<string, HandlebarsTemplateDelegate>();

/**
 * Compile a Handlebars template from disk, with in-memory caching.
 */
const compileTemplate = (templateName: string): HandlebarsTemplateDelegate => {
  if (templateCache.has(templateName)) {
    return templateCache.get(templateName)!;
  }

  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.hbs`);

  if (!fs.existsSync(templatePath)) {
    throw createError(500, `Email template "${templateName}" not found`);
  }

  const templateSource = fs.readFileSync(templatePath, 'utf-8');

  // Also load the layout if available and wrap content
  const layoutPath = path.join(TEMPLATES_DIR, 'layout.hbs');
  let compiled: HandlebarsTemplateDelegate;

  if (fs.existsSync(layoutPath) && templateName !== 'layout') {
    const layoutSource = fs.readFileSync(layoutPath, 'utf-8');
    // Register the content template as a partial
    Handlebars.registerPartial('content', templateSource);
    compiled = Handlebars.compile(layoutSource);
  } else {
    compiled = Handlebars.compile(templateSource);
  }

  templateCache.set(templateName, compiled);
  return compiled;
};

interface SendEmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
  sentBy?: string;
}

interface EmailLogEntry {
  id: string;
  recipient_email: string;
  subject: string;
  template: string;
  status: 'queued' | 'sent' | 'failed';
  error_message?: string;
  sent_by?: string;
  created_at: string;
}

/**
 * Send a single email using a Handlebars template.
 *
 * Workflow:
 * 1. Log the email as "queued" in the email_logs table
 * 2. Compile the template and render HTML
 * 3. Send via nodemailer transporter
 * 4. Update the log entry to "sent" or "failed"
 */
export const sendEmail = async (options: SendEmailOptions): Promise<EmailLogEntry> => {
  const { to, subject, template, data, sentBy } = options;

  logger.info('Attempting to send email', { to, subject, template });

  // Step 1: Create a queued log entry
  const { data: logEntry, error: logError } = await supabaseAdmin
    .from('email_logs')
    .insert({
      recipient_email: to,
      subject,
      template,
      status: 'queued',
      sent_by: sentBy || null,
    })
    .select()
    .single();

  if (logError) {
    logger.error('Failed to create email log entry', { to, subject, error: logError.message });
    // Don't throw — still attempt to send the email
  }

  try {
    // Step 2: Compile template and render
    const compiledTemplate = compileTemplate(template);
    const html = compiledTemplate({
      ...data,
      year: new Date().getFullYear(),
    });

    // Step 3: Send via transporter
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    // Step 4a: Mark as sent
    if (logEntry) {
      const { error: updateError } = await supabaseAdmin
        .from('email_logs')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', logEntry.id);

      if (updateError) {
        logger.warn('Email sent but failed to update log', { logId: logEntry.id, error: updateError.message });
      }
    }

    logger.info('Email sent successfully', { to, subject, template });

    return logEntry || { id: '', recipient_email: to, subject, template, status: 'sent' as const, created_at: new Date().toISOString() };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown email sending error';

    // Step 4b: Mark as failed
    if (logEntry) {
      await supabaseAdmin
        .from('email_logs')
        .update({ status: 'failed', error_message: errorMessage })
        .eq('id', logEntry.id);
    }

    logger.error('Failed to send email', { to, subject, template, error: errorMessage });

    return logEntry
      ? { ...logEntry, status: 'failed' as const, error_message: errorMessage }
      : { id: '', recipient_email: to, subject, template, status: 'failed' as const, error_message: errorMessage, created_at: new Date().toISOString() };
  }
};

interface BulkEmailResult {
  total: number;
  sent: number;
  failed: number;
  results: EmailLogEntry[];
}

/**
 * Send the same email to multiple recipients.
 *
 * Each recipient is processed independently so that individual failures
 * do not block the remaining sends.
 */
export const sendBulkEmail = async (
  recipients: string[],
  subject: string,
  template: string,
  data: Record<string, unknown>,
  sentBy?: string
): Promise<BulkEmailResult> => {
  const results: EmailLogEntry[] = [];
  let sentCount = 0;
  let failedCount = 0;

  for (const to of recipients) {
    try {
      const logEntry = await sendEmail({
        to,
        subject,
        template,
        data,
        sentBy,
      });

      results.push(logEntry);

      if (logEntry.status === 'sent') {
        sentCount++;
      } else {
        failedCount++;
      }
    } catch (err) {
      failedCount++;
      logger.error('Bulk email send failed for recipient', {
        to,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  logger.info('Bulk email completed', {
    total: recipients.length,
    sent: sentCount,
    failed: failedCount,
    template,
  });

  return {
    total: recipients.length,
    sent: sentCount,
    failed: failedCount,
    results,
  };
};

/**
 * Clear the template cache. Useful during development or after template updates.
 */
export const clearTemplateCache = (): void => {
  templateCache.clear();
  logger.debug('Email template cache cleared');
};
