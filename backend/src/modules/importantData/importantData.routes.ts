import { Router, Response, NextFunction } from 'express';
import { auth, AuthRequest } from '../../middleware/auth';
import { rbac } from '../../middleware/rbac';
import { sectionAccess } from '../../middleware/sectionAccess';
import { upload } from '../../middleware/upload';
import * as importantDataController from './importantData.controller';
import * as cloudinaryService from '../../services/cloudinary.service';

const router = Router();

// ── Read (any authenticated user) ─────────────────────────────────────────
router.get('/', auth, importantDataController.getAll);
router.get('/:id', auth, importantDataController.getById);

// ── Create (admin only) — supports primary file + multiple attachments ─────
router.post(
  '/',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('important_data', 'create'),
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'attachments', maxCount: 10 },
  ]),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;

      // Primary file
      if (files?.file?.[0]) {
        const f = files.file[0];
        const result = await cloudinaryService.uploadFile(
          f.buffer,
          'important-data/files',
          f.originalname,
          f.mimetype
        );
        req.body.file_url = result.secure_url;
        req.body.file_type = f.mimetype;
        req.body.file_name = f.originalname;
      }

      // Additional attachments
      if (files?.attachments?.length) {
        const uploaded = await Promise.all(
          files.attachments.map(async (file) => {
            const result = await cloudinaryService.uploadFile(
              file.buffer,
              'important-data/attachments',
              file.originalname,
              file.mimetype
            );
            return { name: file.originalname, url: result.secure_url, type: file.mimetype };
          })
        );
        req.body.attachments = uploaded;
      }

      return importantDataController.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

// ── Update (admin only) ────────────────────────────────────────────────────
router.patch(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('important_data', 'update'),
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'attachments', maxCount: 10 },
  ]),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;

      if (files?.file?.[0]) {
        const f = files.file[0];
        const result = await cloudinaryService.uploadFile(
          f.buffer,
          'important-data/files',
          f.originalname,
          f.mimetype
        );
        req.body.file_url = result.secure_url;
        req.body.file_type = f.mimetype;
        req.body.file_name = f.originalname;
      }

      if (files?.attachments?.length) {
        const uploaded = await Promise.all(
          files.attachments.map(async (file) => {
            const result = await cloudinaryService.uploadFile(
              file.buffer,
              'important-data/attachments',
              file.originalname,
              file.mimetype
            );
            return { name: file.originalname, url: result.secure_url, type: file.mimetype };
          })
        );
        req.body.attachments = uploaded;
      }

      return importantDataController.update(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

// ── Delete (admin only) ────────────────────────────────────────────────────
router.delete(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('important_data', 'delete'),
  importantDataController.remove
);

export default router;

