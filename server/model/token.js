import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    jti: { type: String, required: true },
    token: { type: String, required: true },
    params: { type: Object, required: true }
}, { timestamps: true });

export default mongoose.model('Token', tokenSchema);