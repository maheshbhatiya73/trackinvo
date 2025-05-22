import express from 'express';
import CategoryController from '../controller/CategoryController';
import { authenticateToken, checkRole } from '../middleware/auth';
import asyncHandler from '../middleware/asyncHandler';

const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  MANAGER: 'user'
} as const;

class CategoryRoute {
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
      asyncHandler(CategoryController.createCategory)
    );
    this.router.get(
      '/',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(CategoryController.getAllCategories)
    );
    this.router.get(
      '/:id',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(CategoryController.getCategoryById)
    );
    this.router.put(
      '/:id',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      asyncHandler(CategoryController.updateCategory)
    );
    this.router.delete(
      '/:id',
      checkRole([ROLES.SUPERADMIN]),
      asyncHandler(CategoryController.deleteCategory)
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new CategoryRoute().getRouter();