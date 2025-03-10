import express from 'express';
import multer from 'multer';
import AuthController from '../controller/authController';

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
        cb(null, 'uploads/');
    },
    filename: (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: string) => void) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

class AuthRoutes {
    router: express.Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() { 
        this.router.post('/register', upload.single('avatar'), AuthController.register);
        this.router.post('/login', AuthController.login);
    }

    getRouter() {
        return this.router;
    }
}

export default new AuthRoutes().getRouter();
