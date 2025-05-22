import express from 'express';
import InvoiceController from '../controller/InvoiceController';
import { authenticateToken, checkRole } from '../middleware/auth';
import asyncHandler from '../middleware/asyncHandler';

const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  MANAGER: 'user',
} as const;

class InvoiceRoute {
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
      
      asyncHandler(InvoiceController.createInvoice)
    );

    this.router.get(
      '/',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(InvoiceController.getAllInvoices)
    );

    this.router.get(
      '/:id',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(InvoiceController.getInvoiceById)
    );

    this.router.put(
      '/:id',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(InvoiceController.updateInvoice)
    );

    this.router.delete(
      '/:id',
      checkRole([ROLES.SUPERADMIN]),
      asyncHandler(InvoiceController.deleteInvoice)
    );
    
  }

  getRouter() {
    return this.router;
  }
}

export default new InvoiceRoute().getRouter();