import { Body, Post, Route, Tags } from 'tsoa';
import CustomError from '../../infrastructure/models/error.model';
import MiscUtils from '../../infrastructure/utils/misc.utils';
import Project from '../models/project.model';
import { ProjectService } from '../services/project.service';

@Tags('Core')
@Route(`core/projects`)
export class ProjectController {
  /**
   * Creates a new project object in the database.
   */
  @Post('/')
  public static async create(@Body() projectData: Project): Promise<Project> {
    try {
      const required: string[] = ['name'];
      const hasRequiredData: boolean = MiscUtils.checkRequired(projectData, required);
      if (!hasRequiredData) {
        throw CustomError.REQUIRED_DATA;
      }
      const project: Project = await ProjectService.create(projectData);
      return project;
    } catch (error: any) {
      throw error;
    }
  }
}
