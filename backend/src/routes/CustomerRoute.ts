import express from 'express';
import CustomerController from '../controller/CustomerController';
import { authenticateToken, checkRole } from '../middleware/auth';
import asyncHandler from '../middleware/asyncHandler';

const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  MANAGER: 'user',
} as const;

class CustomerRoute {
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
      asyncHandler(CustomerController.createCustomer)
    );

    this.router.get(
      '/',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(CustomerController.getAllCustomers)
    );

    this.router.get(
      '/:id',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(CustomerController.getCustomerById)
    );

    this.router.put(
      '/:id',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(CustomerController.updateCustomer)
    );

    this.router.delete(
      '/:id',
      checkRole([ROLES.SUPERADMIN]),
      asyncHandler(CustomerController.deleteCustomer)
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new CustomerRoute().getRouter();