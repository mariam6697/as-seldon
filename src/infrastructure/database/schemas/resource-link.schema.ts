import { model, Schema } from 'mongoose';
import ResourceLink from '../../../core/models/resource-link.model';

const ResourceLinkSchema = new Schema<ResourceLink>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    public: { type: Boolean, required: true, default: false },
    type: { type: String, required: true, default: 'other', enum: ['video', 'document', 'other'] },
    project: { type: Schema.Types.ObjectId, ref: 'Project' }
  },
  { timestamps: true }
);

export const ResourceLinkModel = model<ResourceLink>('ResourceLink', ResourceLinkSchema);
