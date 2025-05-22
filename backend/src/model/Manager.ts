import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['superadmin', '', 'superadmin'], },
  status: { type: String, required: true },
  avatar: { type: String, required: true },
  lastLogin: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

const Manager = mongoose.model('Manager', managerSchema);

export default Manager;