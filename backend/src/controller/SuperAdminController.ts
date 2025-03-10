import { Request, Response } from 'express';
import Manager from '../model/Manager';
import User, { IUser } from '../model/user';
import bcrypt from 'bcryptjs';

interface ManagerRequestBody {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  avatar: string;
  lastLogin: string
}

interface UserRequestBody {
  name: string;
  email: string;
  username: string;
  role?: 'user' | 'admin' | 'superadmin';
  password?: string;
  avatar?: string;
}

class SuperAdminController {
  static async createManager(req: Request<{}, {}, ManagerRequestBody>, res: Response): Promise<void> {
    try {
      const { name, email, password, role, status, lastLogin } = req.body;
      const avatar = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

      if (!name || !email || !password || !role || !status || !avatar) {
        res.status(400).json({ message: 'All required fields (name, email, password, role, status, avatar) must be provided' });
        return;
      }

      const existingManager = await Manager.findOne({ email });
      if (existingManager) {
        res.status(400).json({ message: 'Email already in use' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const manager = new Manager({
        name,
        email,
        password: hashedPassword,
        role,
        status,
        lastLogin,
        avatar, 
      });

      await manager.save();
      res.status(201).json({ message: 'Manager created successfully', manager });
    } catch (error) {
      res.status(500).json({ message: 'Error creating manager', error: (error as Error).message });
    }
  }

  static async getAllManagers(req: Request, res: Response): Promise<void> {
    try {
      const managers = await Manager.find().select('-password');
      res.status(200).json({ message: 'Managers retrieved successfully', managers });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving managers', error: (error as Error).message });
    }
  }

  static async getManagerById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const manager = await Manager.findById(id);
      if (!manager) {
        res.status(404).json({ message: 'Manager not found' });
        return;
      }
      res.status(200).json({ message: 'Manager retrieved successfully', manager });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving manager', error: (error as Error).message });
    }
  }
  static async updateManager(
    req: Request<{ id: string }, {}, Partial<ManagerRequestBody>>,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
  
      // Handle avatar upload
      const avatar = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined;
  
      // Prepare update data
      const updateData = { ...req.body };
      if (avatar) updateData.avatar = avatar; // Add avatar only if it exists
  
      // Update manager
      const updatedManager = await Manager.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  
      if (!updatedManager) {
        res.status(404).json({ message: 'Manager not found' });
        return;
      }
  
      res.status(200).json({ message: 'Manager updated successfully', manager: updatedManager });
    } catch (error) {
      res.status(400).json({ message: 'Error updating manager', error: (error as Error).message });
    }
  }  

  static async deleteManager(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedManager = await Manager.findByIdAndDelete(id);
      if (!deletedManager) {
        res.status(404).json({ message: 'Manager not found' });
        return;
      }
      res.status(200).json({ message: 'Manager deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting manager', error: (error as Error).message });
    }
  }

  static async createUser(req: Request<{}, {}, UserRequestBody>, res: Response): Promise<void> {
    try {
      const { username, email, password, role } = req.body;
      console.log(req.body)
      const avatar = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;


      if (!username || !email || !password) {
        res.status(400).json({ message: 'Username, email, and password are required' });
        return;
      }

      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        res.status(400).json({ message: 'User with this email or username already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        avatar,
        role: role || 'user'
      });

      await newUser.save();
      res.status(201).json({ message: 'User created successfully', user: { ...newUser.toObject(), password: undefined } });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error: (error as Error).message });
    }
  }

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find().select('-password');
      res.status(200).json({ message: 'Users retrieved successfully', users });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users', error: (error as Error).message });
    }
  }

  static async getUserById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select('-password');
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json({ message: 'User retrieved successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user', error: (error as Error).message });
    }
  }

  static async updateUser(req: Request<{ id: string }, {}, Partial<UserRequestBody>>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const avatar = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : undefined;
  
      // Prepare update data
      const updateData = { ...req.body };
      if (avatar) updateData.avatar = avatar;

      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: false });
      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      res.status(400).json({ message: 'Error updating user', error: (error as Error).message });
    }
  }

  static async deleteUser(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: (error as Error).message });
    }
  }
}

export default SuperAdminController;
