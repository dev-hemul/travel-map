import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },

  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  middleName: { type: String, default: '' },
  phone: { type: String, default: '' },
  locationText: { type: String, default: '' },

  // особисті мітки
  markers: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

profileSchema.index({ 'markers.location': '2dsphere' });

export default mongoose.model('UserProfile', profileSchema);
