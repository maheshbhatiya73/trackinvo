// models/Unit.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IUnit extends Document {
  name: string;
  abbreviation: string;
  created_at: Date;
  updated_at?: Date;
  deleted?: boolean; // For soft delete
}

const UnitSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  abbreviation: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  deleted: { type: Boolean, default: false }, // Soft delete flag
});

export default mongoose.model<IUnit>('Unit', UnitSchema);