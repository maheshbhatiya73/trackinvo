
import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
  name: string;
  category_id: mongoose.Types.ObjectId;
  unit_id: mongoose.Types.ObjectId;
  price: number;
  created_at: Date;
  updated_at?: Date;
  deleted?: boolean; // For soft delete
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  unit_id: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
  price: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  deleted: { type: Boolean, default: false }, // Soft delete flag
});

export default mongoose.model<IProduct>('Product', ProductSchema);