import mongoose from 'mongoose';

const codesSchema = new mongoose.Schema({
  email: { type: String },
  code: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) } // Expires in 3 days
});

const Codes = mongoose.model('Codes', codesSchema);

export default Codes;
