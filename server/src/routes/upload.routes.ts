import { Router, Response } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { uploadImage, uploadPDF } from '../services/cloudinary.service';
import { createError } from '../middleware/errorHandler';
import { CLOUDINARY_FOLDERS } from '../config/constants';

const router = Router();

// POST / - Upload a file (auth required)
router.post(
  '/',
  auth,
  upload.single('file'),
  async (req: AuthRequest, res: Response, next) => {
    try {
      if (!req.file) {
        throw createError(400, 'No file provided');
      }

      const folder = (req.body.folder as string) || CLOUDINARY_FOLDERS.IMPORTANT_DATA;

      // Validate folder is one of the allowed values
      const allowedFolders = Object.values(CLOUDINARY_FOLDERS);
      if (!allowedFolders.includes(folder as typeof allowedFolders[number])) {
        throw createError(400, `Invalid folder. Allowed values: ${allowedFolders.join(', ')}`);
      }

      let result;

      if (req.file.mimetype === 'application/pdf') {
        result = await uploadPDF(req.file.buffer, folder);
      } else {
        result = await uploadImage(req.file.buffer, folder);
      }

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          bytes: result.bytes,
          resource_type: result.resource_type,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
