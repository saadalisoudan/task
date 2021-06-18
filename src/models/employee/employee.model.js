import mongoose, { Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const EmployeeSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

EmployeeSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret.deleted;
    delete ret.updatedAt;
    delete ret._id;
    delete ret.__v;
  }
});


autoIncrement.initialize(mongoose.connection);
EmployeeSchema.plugin(autoIncrement.plugin, { model: 'employee', startAt: 1 });

export default mongoose.model('employee', EmployeeSchema);
