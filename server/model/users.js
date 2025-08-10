import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  roles: [{ type: String, ref: 'Role' }],
});

export default mongoose.model('User', userSchema, 'users');
