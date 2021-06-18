import mongoose, { Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const PassingSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },
  employee: {
    type: Number,
    ref: 'employee'
  },
  car: {
    type: Number,
    ref: 'car'
  },
  cost: {
    type: Number,
    default: 0
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

PassingSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret.deleted;
    delete ret.updatedAt;
    delete ret._id;
    delete ret.__v;
  }
});


autoIncrement.initialize(mongoose.connection);
PassingSchema.plugin(autoIncrement.plugin, { model: 'passing', startAt: 1 });

export default mongoose.model('passing', PassingSchema);
