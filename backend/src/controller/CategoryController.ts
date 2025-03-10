// controller/CategoryController.ts
import { Request, Response } from 'express';
import Category from '../model/Category';

class CategoryController {
  static async createCategory(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const category = new Category({ name, description });
      await category.save();
      res.status(201).json({ status: 'success', data: category });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  static async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await Category.find({ deleted: false }); 
      res.status(200).json({ status: 'success', data: categories });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getCategoryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id, deleted: false });
      if (!category) return res.status(404).json({ status: 'error', message: 'Category not found' });
      res.status(200).json({ status: 'success', data: category });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const category = await Category.findOneAndUpdate(
        { _id: id, deleted: false },
        { name, description, updated_at: new Date() },
        { new: true }
      );
      if (!category) return res.status(404).json({ status: 'error', message: 'Category not found' });
      res.status(200).json({ status: 'success', data: category });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  static async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Soft Delete
      const category = await Category.findOneAndUpdate(
        { _id: id, deleted: false },
        { deleted: true, updated_at: new Date() },
        { new: true }
      );
      // Hard Delete alternative: await Category.findByIdAndDelete(id);
      if (!category) return res.status(404).json({ status: 'error', message: 'Category not found' });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default CategoryController;