import { Body, Get, Path, Post, Query, Route, Tags } from 'tsoa';
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
}
