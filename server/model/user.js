import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: {
  type: String,
  required: function () {
    return this.provider === 'local';
  },
},
  provider: { type: String, default: 'local' },
  googleId: { type: String},
  avatar: { type: String, default: null },  
   roles: {
  type: [String],
  enum: ['user', 'admin'],
  default: ['user'],
},
  refreshToken: String,
}, {
  timestamps: true
});

  userSchema.pre('save', function (next) {
    if (this.provider === 'local' && this.googleId) {
      console.error('🚨 LOCAL+GOOGLEID SAVE ATTEMPT', this.email, this.googleId);
      return next(new Error('Invariant: local user cannot have googleId'));
    }
    next();
  });


export default mongoose.model('User', userSchema);