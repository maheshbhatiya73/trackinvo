import express from 'express';
import SuperAdminController from '../controller/SuperAdminController';
import { authenticateToken, checkRole } from '../middleware/auth';

const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  MANAGER: 'user'
} as const;

class SuperAdminRoute {
  router: express.Router;
  
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Apply authentication to all routes
    this.router.use(authenticateToken);

    // Manager Routes
    this.router.post('/managers', checkRole([ROLES.SUPERADMIN]), SuperAdminController.createManager);
    this.router.get('/managers', checkRole([ROLES.SUPERADMIN]), SuperAdminController.getAllManagers);
    this.router.get('/managers/:id', checkRole([ROLES.SUPERADMIN]), SuperAdminController.getManagerById);
    this.router.put('/managers/:id', checkRole([ROLES.SUPERADMIN]), SuperAdminController.updateManager);
    this.router.delete('/managers/:id', checkRole([ROLES.SUPERADMIN]), SuperAdminController.deleteManager);
    
    // User Routes
    this.router.post('/users', checkRole([ROLES.SUPERADMIN]), SuperAdminController.createUser);
    this.router.get('/users', checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]), SuperAdminController.getAllUsers);
    this.router.get('/users/:id', checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]), SuperAdminController.getUserById);
    this.router.put('/users/:id', checkRole([ROLES.SUPERADMIN]), SuperAdminController.updateUser);
    this.router.delete('/users/:id', checkRole([ROLES.SUPERADMIN]), SuperAdminController.deleteUser);
  }

  getRouter() {
    return this.router;
  }
}

export default new SuperAdminRoute().getRouter();
