import { Body, Get, Path, Post, Query, Route, Tags } from 'tsoa';
import Project from '../models/project.model';
import { ResourceLinkService } from '../services/resource-link.service';
import { ProjectService } from '../services/project.service';
import ResourceLink from '../models/resource-link.model';

@Tags('Core > Resources links')
@Route(`core/resources-links`)
export class ResourceLinkController {
  /**
   * Creates a new resource link for certain project
   */
  @Post('/{projectId}')
  public static async create(
    @Path() projectId: string,
    @Body() resourceLinkData: ResourceLink
  ): Promise<ResourceLink> {
    try {
      const project: Project = await ProjectService.get({ projectId });
      const resourceLink: ResourceLink = await ResourceLinkService.create(
        project._id,
        resourceLinkData
      );
      return resourceLink;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get
   */
  @Get('/{projectId}')
  public static async getByProjectId(
    @Path() projectId: string,
    @Query() page: number,
    @Query() limit: number
  ): Promise<ResourceLink> {
    try {
      const project: Project = await ProjectService.get({ projectId });
      const result: any = await ResourceLinkService.getByProjectId(project._id, page, limit);
      return result;
    } catch (error: any) {
      throw error;
    }
  }
}
