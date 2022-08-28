import { Body, Get, Path, Post, Put, Query, Route, Tags } from 'tsoa';
import CustomError from '../../infrastructure/models/error.model';
import MiscUtils from '../../infrastructure/utils/misc.utils';
import Project from '../models/project.model';
import { ProjectService } from '../services/project.service';

@Tags('Core')
@Route(`core/projects`)
export class ProjectController {
  /**
   * Creates a new project record in the database.
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

  /**
   * Retrieves data from a project given its nano id.
   */
  @Get('/{projectNanoId}')
  public static async get(@Path() projectNanoId: string): Promise<any> {
    try {
      const select: string =
        'nanoId name description highlighted semester year categories mainImage extraImages';
      const response: any = await ProjectService.get({ projectNanoId, select });
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  @Get('/')
  public static async getAll(
    @Query() page: number,
    @Query() limit: number,
    @Query() highlighted?: boolean,
    @Query() search?: string
  ): Promise<any> {
    try {
      const select: string =
        'nanoId name description shortDescription highlighted semester year categories mainImage extraImages';
      let query: any = { visible: true };
      if (highlighted) {
        query.highlighted = highlighted;
      }
      const result: any = await ProjectService.getAll(page, limit, query, select, search);
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Update a project data given its ID.
   */
  @Put('/{projectId}')
  public static async update(
    @Path() projectId: string,
    @Body() projectData: Project
  ): Promise<any> {
    try {
      const response: any = await ProjectService.update(projectId, projectData);
      return response;
    } catch (error: any) {
      throw error;
    }
  }
}
