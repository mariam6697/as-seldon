import { Body, Delete, Get, Path, Post, Put, Query, Route, Tags } from 'tsoa';
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
   * Get all resources links for certain project
   */
  @Get('/{projectNanoId}')
  public static async getByProjectNanoId(
    @Path() projectNanoId: string,
    @Query() page: number,
    @Query() limit: number
  ): Promise<ResourceLink> {
    try {
      const project: Project = await ProjectService.get({ projectNanoId });
      const result: any = await ResourceLinkService.getByProjectId(project._id, true, page, limit);
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Updates a resource link
   */
  @Put('/{resourceLinkId}')
  public static async update(
    @Path() resourceLinkId: string,
    @Body() resourceLinkData: ResourceLink
  ): Promise<ResourceLink> {
    try {
      const resourceLink: ResourceLink = await ResourceLinkService.get(resourceLinkId);
      const updatedLink: ResourceLink = await ResourceLinkService.update(
        resourceLink._id,
        resourceLinkData
      );
      return updatedLink;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Deletes a resource link
   */
  @Delete('/{resourceLinkId}')
  public static async remove(@Path() resourceLinkId: string): Promise<void> {
    try {
      const resourceLink: ResourceLink = await ResourceLinkService.get(resourceLinkId);
      await ResourceLinkService.remove(resourceLink._id);
    } catch (error: any) {
      throw error;
    }
  }
}
