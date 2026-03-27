import { Router, Response, NextFunction } from 'express';
import { auth, AuthRequest } from '../../middleware/auth';
import { rbac } from '../../middleware/rbac';
import { sectionAccess } from '../../middleware/sectionAccess';
import { upload } from '../../middleware/upload';
import * as noticeController from './notice.controller';
import * as cloudinaryService from '../../services/cloudinary.service';

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────
router.get('/', noticeController.getAll);
router.get('/:id', noticeController.getById);

// ── Create notice: admin OR any user with notices section permission ────────
// Uses sectionAccess instead of rbac so assigned users can also post.
router.post(
  '/',
  auth,
  sectionAccess('notices', 'create'),
  upload.fields([{ name: 'attachments', maxCount: 10 }]),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      let attachment_urls: string[] = [];

      if (req.body.attachment_urls) {
        try {
          attachment_urls = JSON.parse(req.body.attachment_urls);
        } catch (e) {
          attachment_urls = [];
        }
      }

      if (files?.attachments?.length) {
        const uploaded = await Promise.all(
          files.attachments.map(async (file) => {
            const result = await cloudinaryService.uploadFile(
              file.buffer,
              'notices/attachments',
              file.originalname
            );
            return result.secure_url;
          })
        );
        attachment_urls = [...attachment_urls, ...uploaded];
      }
      req.body.attachment_urls = attachment_urls;

      return noticeController.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

// ── Update notice: admin OR assigned user ──────────────────────────────────
router.patch(
  '/:id',
  auth,
  sectionAccess('notices', 'update'),
  upload.fields([{ name: 'attachments', maxCount: 10 }]),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Record<string, Express.Multer.File[]> | undefined;
      let attachment_urls: string[] = [];

      if (req.body.attachment_urls) {
        try {
          attachment_urls = JSON.parse(req.body.attachment_urls);
        } catch (e) {
          attachment_urls = [];
        }
      }

      if (files?.attachments?.length) {
        const uploaded = await Promise.all(
          files.attachments.map(async (file) => {
            const result = await cloudinaryService.uploadFile(
              file.buffer,
              'notices/attachments',
              file.originalname
            );
            return result.secure_url;
          })
        );
        attachment_urls = [...attachment_urls, ...uploaded];
      }
      req.body.attachment_urls = attachment_urls;

      return noticeController.update(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

// ── Delete notice ──────────────────────────────────────────────────────────
router.delete(
  '/:id',
  auth,
  sectionAccess('notices', 'delete'),
  noticeController.remove
);

export default router;
