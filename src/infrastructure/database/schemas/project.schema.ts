import { model, Schema } from 'mongoose';
import Project from '../../../core/models/project.model';

const ProjectSchema = new Schema<Project>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    semester: { type: String, default: null, enum: ['1', '2'] },
    year: { type: String, required: true },
    categories: [{ type: 'ObjectId', ref: 'Category' }],
    updates: [{ type: Object, required: true, default: [] }]
  },
  { timestamps: true }
);

export const ProjectModel = model<Project>('Project', ProjectSchema);
