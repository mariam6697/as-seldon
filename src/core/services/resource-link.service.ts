import { ResourceLinkModel } from '../../infrastructure/database/schemas/resource-link.schema';
import CustomError from '../../infrastructure/models/error.model';
import ResourceLink from '../models/resource-link.model';

export class ResourceLinkService {
  public static async create(projectId: string, resourceLink: ResourceLink): Promise<ResourceLink> {
    resourceLink.project = projectId;
    const newResourceLink: ResourceLink = await ResourceLinkModel.create(resourceLink);
    return newResourceLink;
  }

  public static async get(resourceLinkId: string): Promise<ResourceLink> {
    const resourceLink: ResourceLink = await ResourceLinkModel.findById(resourceLinkId);
    if (!resourceLink) {
      throw CustomError.LINK_NOT_FOUND;
    }
    return resourceLink;
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

  public static async update(
    resourceLinkId: string,
    resourceLink: ResourceLink
  ): Promise<ResourceLink> {
    const updatedLink: ResourceLink = await ResourceLinkModel.findByIdAndUpdate(
      resourceLinkId,
      resourceLink,
      { new: true }
    );
    return updatedLink;
  }

  public static async remove(resourceLinkId: string): Promise<void> {
    await ResourceLinkModel.findByIdAndRemove(resourceLinkId);
  }
}
