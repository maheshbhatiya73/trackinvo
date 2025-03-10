// models/Customer.ts
import mongoose, { Schema, Document } from 'mongoose';

interface ICustomer extends Document {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: Date;
  updated_at?: Date;
  deleted?: boolean; // For soft delete
}

const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  deleted: { type: Boolean, default: false }, // Soft delete flag
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);