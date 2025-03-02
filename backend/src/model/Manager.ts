import mongoose from 'mongoose';

const managerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

const Manager = mongoose.model('Manager', managerSchema);

export default Manager;