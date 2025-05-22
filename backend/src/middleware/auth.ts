import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
    id: string;
    role: string;
    [key: string]: any;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(401).json({ message: 'No token provided in headers' });
        return;
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mahesh123') as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token', error: error });
    }
};

export const checkRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user || !req.user.role) {
            res.status(403).json({ message: 'Role information not found' });
            return;
        }

        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            res.status(403).json({
                message: 'Insufficient permissions',
                requiredRoles: allowedRoles,
                userRole: userRole
            });
            return;
        }

        next();
    };
};
