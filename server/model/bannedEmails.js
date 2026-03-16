import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },

    reason: { type: String, default: '' },

    bannedAt: { type: Date, default: Date.now },
    bannedUntil: { type: Date, default: null }, // null = назавжди

    bannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('BannedEmails', schema);