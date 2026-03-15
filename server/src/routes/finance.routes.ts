import { Router } from 'express';
import { auth } from '../middleware/auth';
import { rbac } from '../middleware/rbac';
import { sectionAccess } from '../middleware/sectionAccess';
import * as financeController from '../controllers/finance.controller';

const router = Router();

// All finance routes require authentication and admin/super_admin role

// =====================
// Fiscal Years
// =====================

// GET /fiscal-years - List all fiscal years
router.get(
  '/fiscal-years',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'read'),
  financeController.getFiscalYears
);

// GET /fiscal-years/:id - Get fiscal year by ID
router.get(
  '/fiscal-years/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'read'),
  financeController.getFiscalYearById
);

// POST /fiscal-years - Create a new fiscal year
router.post(
  '/fiscal-years',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'create'),
  financeController.createFiscalYear
);

// PATCH /fiscal-years/:id - Update a fiscal year
router.patch(
  '/fiscal-years/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'update'),
  financeController.updateFiscalYear
);

// DELETE /fiscal-years/:id - Delete a fiscal year
router.delete(
  '/fiscal-years/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'delete'),
  financeController.deleteFiscalYear
);

// =====================
// Bank Statements
// =====================

// GET /bank-statements - List all bank statements
router.get(
  '/bank-statements',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'read'),
  financeController.getBankStatements
);

// GET /bank-statements/:id - Get bank statement by ID
router.get(
  '/bank-statements/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'read'),
  financeController.getBankStatementById
);

// POST /bank-statements - Create a new bank statement
router.post(
  '/bank-statements',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'create'),
  financeController.createBankStatement
);

// PATCH /bank-statements/:id - Update a bank statement
router.patch(
  '/bank-statements/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'update'),
  financeController.updateBankStatement
);

// DELETE /bank-statements/:id - Delete a bank statement
router.delete(
  '/bank-statements/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'delete'),
  financeController.deleteBankStatement
);

// =====================
// Cost Requests
// =====================

// GET /costs - List all cost requests
router.get(
  '/costs',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'read'),
  financeController.getCostRequests
);

// GET /costs/:id - Get cost request by ID
router.get(
  '/costs/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'read'),
  financeController.getCostRequestById
);

// POST /costs - Create a new cost request
router.post(
  '/costs',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'create'),
  financeController.createCostRequest
);

// PATCH /costs/:id - Update a cost request
router.patch(
  '/costs/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'update'),
  financeController.updateCostRequest
);

// DELETE /costs/:id - Delete a cost request
router.delete(
  '/costs/:id',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'delete'),
  financeController.deleteCostRequest
);

// =====================
// Cost Request Approvals & Check
// =====================

// POST /costs/:id/approve-l1 - Level 1 approval for cost request
router.post(
  '/costs/:id/approve-l1',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'update'),
  financeController.approveL1
);

// POST /costs/:id/approve-l2 - Level 2 approval for cost request
router.post(
  '/costs/:id/approve-l2',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'update'),
  financeController.approveL2
);

// POST /costs/:id/reject - Reject a cost request
router.post(
  '/costs/:id/reject',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'update'),
  financeController.rejectCost
);

// POST /costs/:id/add-check - Add check number to approved cost request
router.post(
  '/costs/:id/add-check',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'update'),
  financeController.addCheckNumber
);

// =====================
// Approvers
// =====================

// GET /approvers - List all finance approvers
router.get(
  '/approvers',
  auth,
  rbac('admin', 'super_admin'),
  sectionAccess('finance', 'read'),
  financeController.getApprovers
);

export default router;
