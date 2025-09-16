import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    refreshToken: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  }, { timestamps: true });

export default mongoose.model('Token', tokenSchema);