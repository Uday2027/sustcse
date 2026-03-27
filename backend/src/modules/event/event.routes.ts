import { Router, Response, NextFunction } from 'express';
import { auth, AuthRequest } from '../../middleware/auth';
import { rbac } from '../../middleware/rbac';
import { sectionAccess } from '../../middleware/sectionAccess';
import { upload } from '../../middleware/upload';
import * as eventController from './event.controller';
import * as cloudinaryService from '../../services/cloudinary.service';
import { createError } from '../../middleware/errorHandler';

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────
router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);

// ── Admin: Create event with optional image + PDF attachments ─────────────
router.post(
  '/',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('events', 'create'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'attachments', maxCount: 10 },
  ]),
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

      // Upload event image to Cloudinary
      if (files?.image?.[0]) {
        const result = await cloudinaryService.uploadImage(
          files.image[0].buffer,
          'events/images'
        );
        req.body.cover_image_url = result.secure_url;
      }

      // Upload PDF / other attachments
      if (files?.attachments?.length) {
        const uploaded = await Promise.all(
          files.attachments.map(async (file) => {
            const result = await cloudinaryService.uploadFile(file.buffer, 'events/attachments', file.originalname);
            return result.secure_url;
          })
        );
        attachment_urls = [...attachment_urls, ...uploaded];
      }
      req.body.attachment_urls = attachment_urls;

      return eventController.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

// ── Admin: Update event with optional image + PDF attachments ─────────────
router.patch(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('events', 'update'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'attachments', maxCount: 10 },
  ]),
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

      if (files?.image?.[0]) {
        const result = await cloudinaryService.uploadImage(
          files.image[0].buffer,
          'events/images'
        );
        req.body.cover_image_url = result.secure_url;
      }

      if (files?.attachments?.length) {
        const uploaded = await Promise.all(
          files.attachments.map(async (file) => {
            const result = await cloudinaryService.uploadFile(file.buffer, 'events/attachments', file.originalname);
            return result.secure_url;
          })
        );
        attachment_urls = [...attachment_urls, ...uploaded];
      }
      req.body.attachment_urls = attachment_urls;

      return eventController.update(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

// ── Admin: Delete event ───────────────────────────────────────────────────
router.delete(
  '/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('events', 'delete'),
  eventController.remove
);

export default router;
