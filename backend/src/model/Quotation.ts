import mongoose, { Schema, Document } from 'mongoose';

interface IProductItem {
  product_id: mongoose.Types.ObjectId;
  quantity: number;
  unit_price: number;
  total_amount: number;
}

interface IQuotation extends Document {
  customer_id: mongoose.Types.ObjectId;
  issue_date: Date;
  expiry_date: Date;
  reference_number: string;
  products: IProductItem[];
  discount_type?: string;
  discount_amount?: number;
  note?: string;
  total_amount: number;
  created_at: Date;
  updated_at?: Date;
  deleted: boolean;
  quotation_template_id?: string
}

const ProductItemSchema: Schema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit_price: { type: Number, required: true, min: 0 },
  total_amount: { type: Number, required: true, min: 0 },
});

const QuotationSchema: Schema = new Schema({
  customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  issue_date: { type: Date, required: true },
  expiry_date: { type: Date, required: true },
  reference_number: { type: String, required: true, unique: true },
  products: [ProductItemSchema],
  discount_type: { type: String, enum: ['fixed', 'percentage'] },
  discount_amount: { type: Number, min: 0 },
  note: { type: String },
  total_amount: { type: Number, required: true, min: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  quotation_template_id: { type: String},
  deleted: { type: Boolean, default: false },
});

export default mongoose.model<IQuotation>('Quotation', QuotationSchema);