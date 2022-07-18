import { model, Schema } from 'mongoose';
import File from '../../../core/models/file.model';

const FileSchema = new Schema<File>(
  {
    extension: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
    base64: { type: String, required: true }
  },
  { timestamps: true }
);

export const FileModel = model<File>('File', FileSchema);
