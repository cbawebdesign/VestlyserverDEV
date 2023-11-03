import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IUser {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  guid: string; // Firebase UserId
  username: string;
  isAnonymous: boolean;
  isDisabled: boolean;
  deletedAt?: Date;
  appVersion: string;
  deviceBrand: string;
  deviceId: string;
  phoneNumber: string;
}

const userSchema = new Schema<IUser>(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    guid: { type: String, required: true },
    username: { type: String },
    phoneNumber: { type: String },
    isAnonymous: { type: Boolean },
    isDisabled: { type: Boolean, default: false },
    deletedAt: { type: Date },
    appVersion: { type: String, required: true },
    deviceBrand: { type: String, required: true },
    deviceId: { type: String, required: true },
  },
  { collection: 'users' }
);

const ModelClass = mongoose.model('User', userSchema, 'users');

export default ModelClass;
