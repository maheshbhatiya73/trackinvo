import express from 'express';
import UnitController from '../controller/UnitController';
import { authenticateToken, checkRole } from '../middleware/auth';
import asyncHandler from '../middleware/asyncHandler';

const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  MANAGER: 'user'
} as const;

class UnitRoute {
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
      asyncHandler(UnitController.createUnit)
    );
    this.router.get(
      '/',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      
      asyncHandler(UnitController.getAllUnits)

    );
    this.router.get(
      '/:id',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      
      asyncHandler(UnitController.getUnitById)
    );
    this.router.put(
      '/:id',
      checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]),
      
      asyncHandler(UnitController.updateUnit)

    );
    this.router.delete(
      '/:id',
      checkRole([ROLES.SUPERADMIN]),
      
      asyncHandler(UnitController.deleteUnit)

    );
  }

  getRouter() {
    return this.router;
  }
}

export default new UnitRoute().getRouter();