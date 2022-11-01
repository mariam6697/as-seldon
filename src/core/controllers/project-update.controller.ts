import { Body, Delete, Get, Path, Post, Put, Query, Route, Tags } from 'tsoa';
import Project, { ProjectUpdate } from '../models/project.model';
import { ProjectUpdateService } from '../services/project-update.service';
import { ProjectService } from '../services/project.service';

@Tags('Core > Projects Updates')
@Route(`core/projects-updates`)
export class ProjectUpdateController {
  /**
   * Creates a new project update record in the database
   */
  @Post('/{projectId}')
  public static async create(
    @Path() projectId: string,
    @Body() projectUpdateData: ProjectUpdate
  ): Promise<ProjectUpdate> {
    try {
      const project: Project = await ProjectService.get({ projectId });
      const projectUpdate: ProjectUpdate = await ProjectUpdateService.create(
        project._id,
        projectUpdateData
      );
      return projectUpdate;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Updates a project update
   */
  @Put('/{projectUpdateId}')
  public static async update(
    @Path() projectUpdateId: string,
    @Body() projectUpdateData: ProjectUpdate
  ): Promise<ProjectUpdate> {
    try {
      const projectUpdate: ProjectUpdate = await ProjectUpdateService.get(projectUpdateId);
      const updatedProjectUpdate: ProjectUpdate = await ProjectUpdateService.update(
        projectUpdate._id,
        projectUpdateData
      );
      return updatedProjectUpdate;
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
  ): Promise<ProjectUpdate> {
    try {
      const project: Project = await ProjectService.get({ projectId });
      const result: any = await ProjectUpdateService.getByProjectId(project._id, page, limit);
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Deletes a project update
   */
  @Delete('/{projectUpdateId}')
  public static async remove(@Path() projectUpdateId: string): Promise<void> {
    try {
      const projectUpdate: ProjectUpdate = await ProjectUpdateService.get(projectUpdateId);
      await ProjectUpdateService.remove(projectUpdate._id);
    } catch (error: any) {
      throw error;
    }
  }
}
