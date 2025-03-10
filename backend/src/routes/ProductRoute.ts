// routes/ProductRoute.ts
import express from 'express';
import ProductController from '../controller/ProductController';
import { authenticateToken, checkRole } from '../middleware/auth';
import asyncHandler from '../middleware/asyncHandler';

const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  MANAGER: 'user'
} as const;

class ProductRoute {
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
      
      asyncHandler(ProductController.createProduct)
    );
    this.router.get(
      '/',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(ProductController.getAllProducts)

    );
    this.router.get(
      '/:id',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(ProductController.getProductById)

    );
    this.router.put(
      '/:id',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(ProductController.updateProduct)

    );
    this.router.delete(
      '/:id',
      checkRole([ROLES.SUPERADMIN]),
      asyncHandler(ProductController.deleteProduct)

    );
  }

  getRouter() {
    return this.router;
  }
}

export default new ProductRoute().getRouter();