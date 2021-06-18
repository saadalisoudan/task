import mongoose, { Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const CarsSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  plateNumber: {
    type: String,
    required: true
  },
  employee: {
    type: Number,
    ref: 'employee'
  },
  card: {
    type: Number,
    default: 0
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

CarsSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret.deleted;
    delete ret.updatedAt;
    delete ret._id;
    delete ret.__v;
  }
});


autoIncrement.initialize(mongoose.connection);
CarsSchema.plugin(autoIncrement.plugin, { model: 'car', startAt: 1 });

export default mongoose.model('car', CarsSchema);
