import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as financeService from './finance.service';
import { uploadFile } from '../../services/cloudinary.service';
import { createError } from '../../middleware/errorHandler';

// =====================
// Fiscal Years
// =====================

/**
 * GET /api/finance/fiscal-years
 * Retrieve all fiscal years.
 */
export const getFiscalYears = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await financeService.getFiscalYears();

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/finance/fiscal-years/:id
 * Retrieve a single fiscal year by ID.
 */
export const getFiscalYearById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await financeService.getFiscalYearById(req.params.id);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/finance/fiscal-years
 * Create a new fiscal year.
 */
export const createFiscalYear = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await financeService.createFiscalYear(req.body);

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/finance/fiscal-years/:id
 * Update a fiscal year.
 */
export const updateFiscalYear = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await financeService.updateFiscalYear(req.params.id, req.body);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/finance/fiscal-years/:id
 * Delete a fiscal year.
 */
export const deleteFiscalYear = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await financeService.deleteFiscalYear(req.params.id);

    res.json({ success: true, message: 'Fiscal year deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// =====================
// Bank Statements
// =====================

/**
 * GET /api/finance/bank-statements
 * Retrieve bank statements with optional fiscal year filter.
 */
export const getBankStatements = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    // Support both fiscal_year_id (snake_case from frontend) and fiscalYearId (camelCase)
    const fiscalYearId = (req.query.fiscal_year_id || req.query.fiscalYearId) as string | undefined;

    const result = await financeService.getBankStatements(page, limit, fiscalYearId);

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/finance/bank-statements/:id
 * Retrieve a single bank statement by ID.
 */
export const getBankStatementById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await financeService.getBankStatementById(req.params.id);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/finance/bank-statements
 * Create a new bank statement, optionally uploading a file to Cloudinary.
 * Accepts multipart/form-data with fields: fiscal_year_id, statement_date, description, amount, notes
 * and an optional `file` attachment (PDF, image, Excel, etc.)
 */
export const createBankStatement = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { fiscal_year_id, statement_date, description, amount, notes } = req.body;

    if (!fiscal_year_id || !statement_date) {
      throw createError(400, 'fiscal_year_id and statement_date are required to upload a bank statement');
    }

    let file_url: string | undefined;
    let file_name: string | undefined;

    const uploadedFile = req.file;
    if (uploadedFile) {
      const uploaded = await uploadFile(
        uploadedFile.buffer,
        'finance/bank-statements',
        uploadedFile.originalname,
        uploadedFile.mimetype
      );
      file_url = uploaded.secure_url;
      file_name = uploadedFile.originalname;
    } else if (req.body.file_url) {
      file_url = req.body.file_url;
      file_name = req.body.file_name || 'Statement';
    }

    const data = await financeService.createBankStatement({
      fiscal_year_id,
      statement_date,
      description: description || null,
      amount: amount ? parseFloat(amount) : null,
      notes: notes || null,
      file_url: file_url || null,
      file_name: file_name || null,
      uploaded_by: req.user!.id,
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/finance/bank-statements/:id
 * Update a bank statement.
 */
export const updateBankStatement = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await financeService.updateBankStatement(req.params.id, req.body);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/finance/bank-statements/:id
 * Delete a bank statement.
 */
export const deleteBankStatement = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await financeService.deleteBankStatement(req.params.id);

    res.json({ success: true, message: 'Bank statement deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// =====================
// Cost Requests
// =====================

/**
 * GET /api/finance/costs
 * Retrieve cost requests with optional fiscal year and status filters.
 */
export const getCostRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const fiscalYearId = req.query.fiscalYearId as string | undefined;
    const status = req.query.status as string | undefined;

    const result = await financeService.getCostRequests(page, limit, fiscalYearId, status);

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/finance/costs/:id
 * Retrieve a single cost request by ID.
 */
export const getCostRequestById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await financeService.getCostRequestById(req.params.id);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/finance/costs
 * Create a new cost request.
 */
export const createCostRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await financeService.createCostRequest(req.body, req.user!.id);

    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/finance/costs/:id
 * Update a cost request.
 */
export const updateCostRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await financeService.updateCostRequest(req.params.id, req.body);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/finance/costs/:id
 * Delete a cost request.
 */
export const deleteCostRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await financeService.deleteCostRequest(req.params.id);

    res.json({ success: true, message: 'Cost request deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// =====================
// Cost Request Approvals & Check
// =====================

/**
 * POST /api/finance/costs/:id/approve-l1
 * Level 1 approval for a cost request.
 */
export const approveL1 = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { remarks } = req.body;
    const data = await financeService.approveL1(req.params.id, req.user!.id, remarks);

    res.json({ success: true, data, message: 'Level 1 approval granted' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/finance/costs/:id/approve-l2
 * Level 2 approval for a cost request.
 */
export const approveL2 = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { remarks } = req.body;
    const data = await financeService.approveL2(req.params.id, req.user!.id, remarks);

    res.json({ success: true, data, message: 'Level 2 approval granted' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/finance/costs/:id/reject
 * Reject a cost request.
 */
export const rejectCost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body;
    const data = await financeService.rejectCost(req.params.id, req.user!.id, reason);

    res.json({ success: true, data, message: 'Cost request rejected' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/finance/costs/:id/add-check
 * Add a check number to a fully approved cost request.
 */
export const addCheckNumber = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { checkNumber, checkDate } = req.body;

    if (!checkNumber || !checkDate) {
      return res.status(400).json({
        success: false,
        message: 'checkNumber and checkDate are required',
      });
    }

    const data = await financeService.addCheckNumber(
      req.params.id,
      checkNumber,
      checkDate,
      req.user!.id
    );

    res.json({ success: true, data, message: 'Check number added, cost request completed' });
  } catch (error) {
    next(error);
  }
};

// =====================
// Approvers
// =====================

/**
 * GET /api/finance/approvers
 * Retrieve the list of configured finance approvers.
 */
export const getApprovers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fiscalYearId = req.query.fiscalYearId as string | undefined;
    const data = await financeService.getApprovers(fiscalYearId);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};


