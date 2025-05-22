import mongoose, { Schema, Document } from 'mongoose';

interface IProductItem {
  product_id: mongoose.Types.ObjectId;
  quantity: number;
  unit_price: number;
  total_amount: number;
}

interface IInvoice extends Document {
  customer_id: mongoose.Types.ObjectId;
  issue_date: Date;
  due_date: Date;
  reference_number: string;
  invoice_template_id: string;
  recurring: boolean;
  cycle?: string;
  products: IProductItem[];
  discount_type: string;
  discount_amount: number;
  note?: string;
  total_amount: number;
  created_at: Date;
  updated_at?: Date;
  deleted?: boolean;
}

const ProductItemSchema: Schema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit_price: { type: Number, required: true, min: 0 },
  total_amount: { type: Number, required: true, min: 0 },
});

const InvoiceSchema: Schema = new Schema({
  customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  issue_date: { type: Date, required: true },
  due_date: { type: Date, required: true },
  reference_number: { type: String, required: true, unique: true },
  recurring: { type: Boolean, default: false },
  cycle: {
    type: String,
    enum: ['week', 'month', 'year']
  },
  products: [ProductItemSchema],
  invoice_template_id: {
    type: String,
  },
  discount_type: { type: String, enum: ['fixed', 'percentage'], required: true },
  discount_amount: { type: Number, required: true, min: 0 },
  note: { type: String },
  total_amount: { type: Number, required: true, min: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  deleted: { type: Boolean, default: false },
});


InvoiceSchema.pre('save', function (next) {
  const invoice = this as unknown as IInvoice;
  let subtotal = invoice.products.reduce((sum, item) => sum + item.total_amount, 0);
  if (invoice.discount_type === 'percentage') {
    const discount = (subtotal * invoice.discount_amount) / 100;
    invoice.total_amount = subtotal - discount;
  } else {
    invoice.total_amount = subtotal - invoice.discount_amount;
  }
  next();
});

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);