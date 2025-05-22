
import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
  name: string;
  description?: string;
  created_at: Date;
  updated_at?: Date;
  deleted?: boolean; // For soft delete
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  deleted: { type: Boolean, default: false }, // Soft delete flag
});

export default mongoose.model<ICategory>('Category', CategorySchema);