import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: null },
  provider: { type: String, default: 'local' }, 
  roles: {
  type: [String],
  enum: ['user', 'admin'],
  default: ['user'],
},
  refreshToken: String,
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);