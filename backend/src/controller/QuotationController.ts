import { Request, Response, NextFunction } from 'express';
import Customer from '../model/Customer';
import Product from '../model/Product';
import Quotation from '../model/Quotation';

class QuotationController {
    static async createQuotation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {
                customer_id,
                issue_date,
                expiry_date,
                reference_number,
                products,
                discount_type,
                discount_amount,
                quotation_template_id,
                note,
            } = req.body;

            // Validate required fields
            if (!customer_id || !issue_date || !expiry_date || !products) {
                res.status(400).json({ status: 'error', message: 'Missing required fields' });
                return;
            }

            const customer = await Customer.findById(customer_id);
            if (!customer) {
                res.status(404).json({ status: 'error', message: 'Customer not found' });
                return;
            }

            for (const item of products) {
                const product = await Product.findById(item.product_id);
                if (!product) {
                    res.status(404).json({ status: 'error', message: `Product ${item.product_id} not found` });
                    return;
                }
                item.unit_price = product.price;
                item.total_amount = item.quantity * item.unit_price;
            }

            const subtotal = products.reduce((sum: number, item: { total_amount: number }) => sum + item.total_amount, 0);
            let total_amount = subtotal;

            if (discount_type && discount_amount) {
                total_amount = discount_type === 'percentage'
                    ? subtotal - (subtotal * discount_amount) / 100
                    : subtotal - discount_amount;
            }

            const quotation = new Quotation({
                customer_id,
                issue_date,
                expiry_date,
                reference_number,
                products,
                discount_type,
                discount_amount,
                quotation_template_id,
                note,
                total_amount,
            });

            await quotation.save();
            res.status(201).json({ status: 'success', data: quotation });
        } catch (error) {
            next(error);
        }
    }

    static async getAllQuotations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const quotations = await Quotation.find({ deleted: false })
                .populate('customer_id')
                .populate('products.product_id');
            res.status(200).json({ status: 'success', data: quotations });
        } catch (error) {
            next(error);
        }
    }

    static async getQuotationById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const quotation = await Quotation.findOne({ _id: id, deleted: false })
                .populate('customer_id')
                .populate('products.product_id');
            if (!quotation) {
                res.status(404).json({ status: 'error', message: 'Quotation not found' });
                return;
            }
            res.status(200).json({ status: 'success', data: quotation });
        } catch (error) {
            next(error);
        }
    }

    static async updateQuotation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const updates = req.body;

            const quotation = await Quotation.findOne({ _id: id, deleted: false });
            if (!quotation) {
                res.status(404).json({ status: 'error', message: 'Quotation not found' });
                return;
            }

            if (updates.customer_id) {
                const customer = await Customer.findById(updates.customer_id);
                if (!customer) {
                    res.status(404).json({ status: 'error', message: 'Customer not found' });
                    return;
                }
            }

            if (updates.products) {
                for (const item of updates.products) {
                    const product = await Product.findById(item.product_id);
                    if (!product) {
                        res.status(404).json({ status: 'error', message: `Product ${item.product_id} not found` });
                        return;
                    }
                    item.unit_price = product.price;
                    item.total_amount = item.quantity * item.unit_price;
                }
            }

            Object.assign(quotation, updates);
            quotation.updated_at = new Date();
            await quotation.save();
            res.status(200).json({ status: 'success', data: quotation });
        } catch (error) {
            next(error);
        }
    }

    static async deleteQuotation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const quotation = await Quotation.findOneAndDelete({ _id: id});
            if (!quotation) {
                res.status(404).json({ status: 'error', message: 'Quotation not found' });
                return;
            }
            res.status(204).json({ status: 'success', message: 'Quotation deleted' });
        } catch (error) {
            next(error);
        }
    }
}

export default QuotationController;