import cloudinary from '../config/cloudinary';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

interface UploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  resource_type: string;
}

/**
 * Upload an image buffer to Cloudinary with automatic quality and format optimization.
 */
export const uploadImage = async (
  fileBuffer: Buffer,
  folder: string
): Promise<UploadResult> => {
  try {
    const result = await new Promise<UploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.url,
              secure_url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              bytes: result.bytes,
              resource_type: result.resource_type,
            });
          } else {
            reject(new Error('Upload returned no result'));
          }
        }
      );

      uploadStream.end(fileBuffer);
    });

    logger.info('Image uploaded to Cloudinary', {
      publicId: result.public_id,
      folder,
      bytes: result.bytes,
    });

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown upload error';
    logger.error('Cloudinary image upload failed', { folder, error: message });
    throw createError(500, `Image upload failed: ${message}`);
  }
};

/**
 * Upload a PDF buffer to Cloudinary as a raw resource.
 */
export const uploadPDF = async (
  fileBuffer: Buffer,
  folder: string
): Promise<UploadResult> => {
  try {
    const result = await new Promise<UploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'raw',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.url,
              secure_url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              bytes: result.bytes,
              resource_type: result.resource_type,
            });
          } else {
            reject(new Error('Upload returned no result'));
          }
        }
      );

      uploadStream.end(fileBuffer);
    });

    logger.info('PDF uploaded to Cloudinary', {
      publicId: result.public_id,
      folder,
      bytes: result.bytes,
    });

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown upload error';
    logger.error('Cloudinary PDF upload failed', { folder, error: message });
    throw createError(500, `PDF upload failed: ${message}`);
  }
};

/**
 * Delete a file from Cloudinary by its public ID.
 */
export const deleteFile = async (publicId: string): Promise<void> => {
  try {
    // Try image first, then raw if not found
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'not found') {
      // Attempt deletion as raw resource (for PDFs)
      const rawResult = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw',
      });

      if (rawResult.result === 'not found') {
        logger.warn('File not found on Cloudinary for deletion', { publicId });
        throw createError(404, 'File not found on Cloudinary');
      }
    }

    logger.info('File deleted from Cloudinary', { publicId });
  } catch (err) {
    if (err && typeof err === 'object' && 'statusCode' in err) {
      throw err; // Re-throw AppError
    }
    const message = err instanceof Error ? err.message : 'Unknown deletion error';
    logger.error('Cloudinary file deletion failed', { publicId, error: message });
    throw createError(500, `File deletion failed: ${message}`);
  }
};

/**
 * Generic upload for any file type.
 */
export const uploadFile = async (
  fileBuffer: Buffer,
  folder: string,
  originalName: string,
  mimetype?: string
): Promise<UploadResult> => {
  let resource_type: 'image' | 'video' | 'raw' | 'auto' = 'auto';
  
  if (mimetype) {
    if (mimetype.startsWith('image/')) {
      resource_type = 'image';
    } else if (mimetype.startsWith('video/')) {
      resource_type = 'video';
    } else if (mimetype === 'application/pdf') {
       // Cloudinary recommends raw for PDF, although image could theoretically extract covers
      resource_type = 'raw';
    } else {
      resource_type = 'raw';
    }
  }

  try {
    const result = await new Promise<UploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type,
          public_id: originalName?.split('.').slice(0, -1).join('.'), // optional
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.url,
              secure_url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              bytes: result.bytes,
              resource_type: result.resource_type,
            });
          } else {
            reject(new Error('Upload returned no result'));
          }
        }
      );

      uploadStream.end(fileBuffer);
    });

    logger.info('File uploaded to Cloudinary', {
      publicId: result.public_id,
      folder,
      bytes: result.bytes,
    });

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown upload error';
    logger.error('Cloudinary file upload failed', { folder, error: message });
    throw createError(500, `File upload failed: ${message}`);
  }
};

