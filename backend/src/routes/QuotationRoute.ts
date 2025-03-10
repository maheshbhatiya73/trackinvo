import express from 'express';
import { authenticateToken, checkRole } from '../middleware/auth';
import asyncHandler from '../middleware/asyncHandler';
import QuotationController from '../controller/QuotationController';

const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  MANAGER: 'user',
} as const;

class QuotationRoute {
  router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(authenticateToken);

    this.router.post(
      '/',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(QuotationController.createQuotation)
    );

    this.router.get(
      '/',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(QuotationController.getAllQuotations)
    );

    this.router.get(
      '/:id',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(QuotationController.getQuotationById)
    );

    this.router.put(
      '/:id',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(QuotationController.updateQuotation)
    );

    this.router.delete(
      '/:id',
      checkRole([ROLES.SUPERADMIN]),
      asyncHandler(QuotationController.deleteQuotation)
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new QuotationRoute().getRouter();