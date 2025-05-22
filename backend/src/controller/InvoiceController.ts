
import { Request, Response, NextFunction } from 'express';
import Customer from '../model/Customer';
import Product from '../model/Product';
import Invoice from '../model/Invoice';

class InvoiceController {
    static createInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {
                customer_id,
                issue_date,
                due_date,
                reference_number,
                recurring,
                cycle,
                products,
                discount_type,
                discount_amount,
                invoice_template_id,
                note,
            } = req.body;
            console.log(req.body)

            // Validate customer exists
            const customer = await Customer.findById({ _id: customer_id });
            if (!customer) {
                res.status(404).json({ status: 'error', message: 'Customer not found' });
                return;
            }

            // Validate products exist and calculate total_amount for each
            for (const item of products) {
                const product = await Product.findById({_id: item.product_id});
                if (!product) {
                  res.status(404).json({ status: 'error', message: `Product ${item.product_id} not found` });
                  return;
                }
                item.unit_price = product.price; 
                item.total_amount = item.quantity * item.unit_price;  // Ensure total_amount is set
              }
              

            let subtotal = products.reduce((sum: any, item: { total_amount: any; }) => sum + item.total_amount, 0);
            let total_amount = subtotal;

            if (discount_type === 'percentage') {
                const discount = (subtotal * discount_amount) / 100;
                total_amount = subtotal - discount;
            } else {
                total_amount = subtotal - discount_amount;
            }


            const invoice = new Invoice({
                customer_id,
                issue_date,
                due_date,
                reference_number,
                recurring,
                cycle: recurring ? cycle : undefined,
                products,
                discount_type,
                discount_amount,
                invoice_template_id,
                note,
                total_amount,
            });

            await invoice.save();
            res.status(201).json({ status: 'success', data: invoice });
        } catch (error) {
            next(error);
        }
    };

    static getAllInvoices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const invoices = await Invoice.find({ deleted: false })
                .populate('customer_id')
                .populate('products.product_id');
            res.status(200).json({ status: 'success', data: invoices });
        } catch (error) {
            next(error);
        }
    };

    static getInvoiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const invoice = await Invoice.findOne({ _id: id, deleted: false })
                .populate('customer_id')
                .populate('products.product_id');
            if (!invoice) {
                res.status(404).json({ status: 'error', message: 'Invoice not found' });
                return;
            }
            res.status(200).json({ status: 'success', data: invoice });
        } catch (error) {
            next(error);
        }
    };

    static updateInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const {
                customer_id,
                issue_date,
                due_date,
                reference_number,
                recurring,
                cycle,
                products,
                discount_type,
                discount_amount,
                invoice_template_id,
                note,
            } = req.body;

            const invoice = await Invoice.findOne({ _id: id, deleted: false });
            if (!invoice) {
                res.status(404).json({ status: 'error', message: 'Invoice not found' });
                return;
            }

            // Validate customer if updated
            if (customer_id) {
                const customer = await Customer.findById(customer_id);
                if (!customer) {
                    res.status(404).json({ status: 'error', message: 'Customer not found' });
                    return;
                }
                invoice.customer_id = customer_id;
            }

            // Validate products if updated
            if (products) {
                for (const item of products) {
                    const product = await Product.findById(item.product_id);
                    if (!product) {
                        res.status(404).json({ status: 'error', message: `Product ${item.product_id} not found` });
                        return;
                    }
                    item.unit_price = product.price;
                    item.total_amount = item.quantity * item.unit_price;
                }
                invoice.products = products;
            }

            // Update fields
            if (issue_date) invoice.issue_date = new Date(issue_date);
            if (due_date) invoice.due_date = new Date(due_date);
            if (reference_number) invoice.reference_number = reference_number;
            if (typeof recurring === 'boolean') {
                invoice.recurring = recurring;
                invoice.cycle = recurring ? cycle : undefined;
            }
            if(invoice_template_id) invoice.invoice_template_id = invoice_template_id
            if (discount_type) invoice.discount_type = discount_type;
            if (discount_amount !== undefined) invoice.discount_amount = discount_amount;
            if (note !== undefined) invoice.note = note;

            invoice.updated_at = new Date();
            await invoice.save();
            res.status(200).json({ status: 'success', data: invoice });
        } catch (error) {
            next(error);
        }
    };

    static deleteInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const invoice = await Invoice.findOneAndUpdate(
                { _id: id, deleted: false },
                { deleted: true, updated_at: new Date() },
                { new: true }
            );
            if (!invoice) {
                res.status(404).json({ status: 'error', message: 'Invoice not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    
}

export default InvoiceController;