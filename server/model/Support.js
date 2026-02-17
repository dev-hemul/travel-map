import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  username: String,
  name: String,
  subject: String,
  message: String,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved'],
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  messageId: Number,
  resolvedBy: String,
  resolvedAt: Date,
});

const Support = mongoose.model('Support', supportSchema);
export default Support;
