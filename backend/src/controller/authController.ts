import { Request, Response } from 'express';
import User, { IUser } from '../model/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mahesh123';

export default class AuthController {
    
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, email, password, role, status } = req.body;
            const avatar = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

            if (!username || !email || !password) {
                res.status(400).json({ 
                    message: "Please provide all required fields: username, email, and password" 
                });
                return;
            }

            if (username.length < 3) {
                res.status(400).json({ 
                    message: "Username must be at least 3 characters long" 
                });
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                res.status(400).json({ 
                    message: "Please provide a valid email address" 
                });
                return;
            }

            if (password.length < 6) {
                res.status(400).json({ 
                    message: "Password must be at least 6 characters long" 
                });
                return;
            }

            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                res.status(400).json({ 
                    message: existingUser.email === email 
                        ? "Email already exists" 
                        : "Username already exists" 
                });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                username,
                email,
                password: hashedPassword,
                role: role || 'user',
                status: status || 'active',
                avatar
            });

            await user.save();

            res.status(201).json({ 
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    lastLogin: user.lastLogin,
                    avatar: user.avatar
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ 
                message: 'Server error during registration',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                res.status(400).json({ message: 'Invalid credentials' });
                return;
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(400).json({ message: 'Invalid credentials' });
                return;
            }
            
            user.lastLogin = new Date().toISOString();
            await user.save();
    
            const token = jwt.sign(
                { id: user._id, role: user.role },
                JWT_SECRET,
                { expiresIn: '7d' }
            );
    
            res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    lastLogin: user.lastLogin 
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
}