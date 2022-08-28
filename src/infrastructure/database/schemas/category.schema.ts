import { model, Schema } from 'mongoose';
import Category from '../../../core/models/category.model';

const CategorySchema = new Schema<Category>(
  {
    nanoId: { type: String, required: true, unique: true, dropDups: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    description: { type: String, required: false },
    textHexColor: { type: String, required: true, default: 'ffffff' },
    backgroundHexColor: { type: String, required: true, default: '000000' }
  },
  { timestamps: true }
);

export const CategoryModel = model<Category>('Category', CategorySchema);
