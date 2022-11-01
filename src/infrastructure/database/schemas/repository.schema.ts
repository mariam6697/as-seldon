import { model, Schema } from 'mongoose';
import Repository from '../../../core/models/repository.model';

const RepositorySchema = new Schema<Repository>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    id: { type: Number, required: true },
    private: { type: Boolean, required: true, default: false },
    project: { type: Schema.Types.ObjectId, ref: 'Project' }
  },
  { timestamps: true }
);

export const RepositoryModel = model<Repository>('Repository', RepositorySchema);
