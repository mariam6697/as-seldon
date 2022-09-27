import { ResourceLinkModel } from '../../infrastructure/database/schemas/resource-link.schema';
import ResourceLink from '../models/resource-link.model';

export class ResourceLinkService {
  public static async create(projectId: string, resourceLink: ResourceLink): Promise<ResourceLink> {
    resourceLink.project = projectId;
    const newResourceLink: ResourceLink = await ResourceLinkModel.create(resourceLink);
    return newResourceLink;
  }

  public static async getByProjectId(projectId: string, page: number, limit: number): Promise<any> {
    const offset: number = (page - 1) * limit;
    const result: any = await ResourceLinkModel.find({ project: projectId })
      .skip(offset)
      .limit(limit);
    const resourceLinks: ResourceLink[] = result;
    const totalItems: number = await ResourceLinkModel.countDocuments({ project: projectId });
    return { totalItems, limit, page, resourceLinks };
  }
}
