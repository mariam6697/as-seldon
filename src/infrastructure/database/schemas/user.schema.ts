import { model, Schema } from 'mongoose';
import User from '../../../auth/models/user.model';

const UserSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'maintainer', enum: ['maintainer', 'admin'] },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    password: { type: String, select: false },
    enabled: { type: Boolean, select: true, default: true }
  },
  { timestamps: true }
);

export const UserModel = model<User>('User', UserSchema);
