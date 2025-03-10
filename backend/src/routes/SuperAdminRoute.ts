import express from 'express';
import SuperAdminController from '../controller/SuperAdminController';
import { authenticateToken, checkRole } from '../middleware/auth';
import multer from 'multer';

const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  MANAGER: 'user'
} as const;

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

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
    this.router.post('/managers', checkRole([ROLES.SUPERADMIN]), upload.single('avatar'), SuperAdminController.createManager);
    this.router.get('/managers', checkRole([ROLES.SUPERADMIN]),  SuperAdminController.getAllManagers);
    this.router.get('/managers/:id', checkRole([ROLES.SUPERADMIN]),  SuperAdminController.getManagerById);
    this.router.put('/managers/:id', checkRole([ROLES.SUPERADMIN]), upload.single('avatar'), SuperAdminController.updateManager);
    this.router.delete('/managers/:id', checkRole([ROLES.SUPERADMIN]),  SuperAdminController.deleteManager);

    // User Routes
    this.router.post('/users', checkRole([ROLES.SUPERADMIN]), upload.single('avatar'), SuperAdminController.createUser);
    this.router.get('/users', checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]), upload.single('avatar'), SuperAdminController.getAllUsers);
    this.router.get('/users/:id', checkRole([ROLES.SUPERADMIN, ROLES.MANAGER]), upload.single('avatar'), SuperAdminController.getUserById);
    this.router.put('/users/:id', checkRole([ROLES.SUPERADMIN]), upload.single('avatar'), SuperAdminController.updateUser);
    this.router.delete('/users/:id', checkRole([ROLES.SUPERADMIN]), upload.single('avatar'), SuperAdminController.deleteUser);
  }

  getRouter() {
    return this.router;
  }
}

export default new SuperAdminRoute().getRouter();
