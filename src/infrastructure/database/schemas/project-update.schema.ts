import { model, Schema } from 'mongoose';
import { ProjectUpdate } from '../../../core/models/project.model';

const ProjectUpdateSchema = new Schema<ProjectUpdate>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    date: { type: Date, required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project' }
  },
  { timestamps: true }
);

export const ProjectUpdateModel = model<ProjectUpdate>('ProjectUpdate', ProjectUpdateSchema);
