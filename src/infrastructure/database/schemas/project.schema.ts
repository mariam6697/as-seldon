import { model, Schema } from 'mongoose';
import Project from '../../../core/models/project.model';

const ProjectSchema = new Schema<Project>(
  {
    nanoId: { type: String, required: true, unique: true, dropDups: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    shortDescription: { type: String, required: false },
    highlighted: { type: Boolean, required: true, default: false },
    visible: { type: Boolean, required: true, default: true },
    semester: { type: String, default: null, enum: ['1', '2'] },
    year: { type: String, required: true },
    categories: [{ type: 'ObjectId', ref: 'Category' }],
    updates: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true, default: [] }],
    mainImage: { type: Schema.Types.ObjectId, ref: 'File' },
    extraImages: [{ type: Schema.Types.ObjectId, ref: 'File', required: true, default: [] }]
  },
  { timestamps: true }
);

export const ProjectModel = model<Project>('Project', ProjectSchema);
