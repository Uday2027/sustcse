import { Router } from 'express';
import multer from 'multer';
import { auth } from '../../middleware/auth';
import { rbac } from '../../middleware/rbac';
import { sectionAccess } from '../../middleware/sectionAccess';
import * as financeController from './finance.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// ── Fiscal Years ───────────────────────────────────────────────────────────
router.get('/fiscal-years',     auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'read'), financeController.getFiscalYears);
router.get('/fiscal-years/:id', auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'read'), financeController.getFiscalYearById);
router.post('/fiscal-years',    auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'create'), financeController.createFiscalYear);
router.patch('/fiscal-years/:id', auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'update'), financeController.updateFiscalYear);
router.delete('/fiscal-years/:id', auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'delete'), financeController.deleteFiscalYear);

// ── Bank Statements ────────────────────────────────────────────────────────
router.get('/bank-statements',      auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'read'), financeController.getBankStatements);
router.get('/bank-statements/:id',  auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'read'), financeController.getBankStatementById);
router.post('/bank-statements',     auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'create'), upload.single('file'), financeController.createBankStatement);
router.patch('/bank-statements/:id', auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'update'), financeController.updateBankStatement);
router.delete('/bank-statements/:id', auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'delete'), financeController.deleteBankStatement);

// ── Cost Requests ──────────────────────────────────────────────────────────
// GET cost requests: admin only
router.get('/costs',     auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'read'), financeController.getCostRequests);
router.get('/costs/:id', auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'read'), financeController.getCostRequestById);

// POST cost request: any user SELECTED by admin (finance.can_create permission)
// Admin grants this via admin_permissions table, so sectionAccess handles it.
router.post('/costs', auth, sectionAccess('finance', 'create'), financeController.createCostRequest);

// PATCH / DELETE cost requests: admin only
router.patch('/costs/:id',  auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'update'), financeController.updateCostRequest);
router.delete('/costs/:id', auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'delete'), financeController.deleteCostRequest);

// ── Approvals ──────────────────────────────────────────────────────────────
router.post('/costs/:id/approve-l1', auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'update'), financeController.approveL1);
router.post('/costs/:id/approve-l2', auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'update'), financeController.approveL2);
router.post('/costs/:id/reject',     auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'update'), financeController.rejectCost);
router.post('/costs/:id/add-check',  auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'update'), financeController.addCheckNumber);

// ── Approvers ──────────────────────────────────────────────────────────────
router.get('/approvers', auth, rbac('admin', 'super_admin'), sectionAccess('finance', 'read'), financeController.getApprovers);

export default router;

