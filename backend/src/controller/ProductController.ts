import { Request, Response } from 'express';
import Product from '../model/Product';

class ProductController {
  static async createProduct(req: Request, res: Response) {
    try {
      const { name, category_id, unit_id, price } = req.body;
      const product = new Product({ name, category_id, unit_id, price });
      await product.save();
      res.status(201).json({ status: 'success', data: product });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await Product.find({ deleted: false }).populate('category_id').populate('unit_id');
      res.status(200).json({ status: 'success', data: products });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await Product.findOne({ _id: id, deleted: false })
        .populate('category_id')
        .populate('unit_id');
      if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
      res.status(200).json({ status: 'success', data: product });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, category_id, unit_id, price } = req.body;
      const product = await Product.findOneAndUpdate(
        { _id: id, deleted: false },
        { name, category_id, unit_id, price, updated_at: new Date() },
        { new: true }
      ).populate('category_id').populate('unit_id');
      if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
      res.status(200).json({ status: 'success', data: product });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await Product.findOneAndUpdate(
        { _id: id, deleted: false },
        { deleted: true, updated_at: new Date() },
        { new: true }
      );
      if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default ProductController;