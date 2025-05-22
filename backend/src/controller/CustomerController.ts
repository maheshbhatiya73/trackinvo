
import { Request, Response, NextFunction } from 'express';
import Customer from '../model/Customer';

class CustomerController {
  static createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, phone, address } = req.body;
      const existingcustomer = await Customer.findOne({ $or: [{ email }] });
      if (existingcustomer) {
        res.status(400).json({ message: 'customer with this email already exists' });
        return;
      }
      const customer = new Customer({ name, email, phone, address });

      await customer.save();
      res.status(201).json({ status: 'success', data: customer });
    } catch (error) {
      next(error);
    }
  };

  static getAllCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customers = await Customer.find();
      res.status(200).json({ status: 'success', data: customers });
    } catch (error) {
      next(error);
    }
  };

  static getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const customer = await Customer.findOne({ _id: id, deleted: false });
      if (!customer) {
        res.status(404).json({ status: 'error', message: 'Customer not found' });
        return;
      }
      res.status(200).json({ status: 'success', data: customer });
    } catch (error) {
      next(error);
    }
  };

  static updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, email, phone, address } = req.body;
      const customer = await Customer.findOneAndUpdate(
        { _id: id, deleted: false },
        { name, email, phone, address, updated_at: new Date() },
        { new: true }
      );
      if (!customer) {
        res.status(404).json({ status: 'error', message: 'Customer not found' });
        return;
      }
      res.status(200).json({ status: 'success', data: customer });
    } catch (error) {
      next(error);
    }
  };

  static deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const customer = await Customer.findByIdAndDelete({_id: id});
      if (!customer) {
        res.status(404).json({ status: 'error', message: 'Customer not found' });
        return;
      }
      res.status(200).json({ status: 'success', message: "customer deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default CustomerController;