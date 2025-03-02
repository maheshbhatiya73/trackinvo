import express from 'express';
import AuthController from '../controller/authController';

class authRoutes {
    router: any;
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() { 
        this.router.post('/register', AuthController.register)
        this.router.post('/login', AuthController.login)
    }
    getRouter() {
        return this.router;
      }
}

export default new  authRoutes().getRouter()