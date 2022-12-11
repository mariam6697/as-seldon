import { Body, Get, Path, Post, Put, Query, Route, Tags } from 'tsoa';
import CustomError from '../../infrastructure/models/error.model';
import MiscUtils from '../../infrastructure/utils/misc.utils';
import Category from '../models/category.model';
import Project from '../models/project.model';
import { CategoryService } from '../services/category.service';
import { ProjectService } from '../services/project.service';

@Tags('Core > Projects')
@Route(`core/projects`)
export class ProjectController {
  /**
   * Creates a new project record in the database
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
   * Retrieves data from a project given its nano ID
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

  /**
   * Retrieves a paginated projects list
   */
  @Get('/')
  public static async getAll(
    @Query() page: number,
    @Query() limit: number,
    @Query() highlighted?: boolean,
    @Query() cat?: string,
    @Query() semester?: string,
    @Query() year?: string
  ): Promise<any> {
    try {
      let catsIds: string[] = [];
      const select: string =
        'nanoId name description shortDescription highlighted semester year categories mainImage extraImages';
      let query: any = { visible: true };
      if (highlighted) {
        query.highlighted = highlighted;
      }
      if (cat) {
        const cats: string[] = cat.split(',');
        for (let selectedCat of cats) {
          let category: Category = await CategoryService.getByLabel(selectedCat);
          catsIds.push(category._id);
        }
      }
      const result: any = await ProjectService.getAll(
        page,
        limit,
        query,
        select,
        catsIds,
        semester,
        year
      );
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Update a project data given its ID
   */
  @Put('/{projectId}')
  public static async update(
    @Path() projectId: string,
    @Body() project: Project
  ): Promise<Project> {
    try {
      const response: Project = await ProjectService.update(projectId, project);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Deletes project given its nano ID
   */
  @Get('/{projectId}')
  public static async remove(@Path() projectId: string): Promise<void> {
    try {
      await ProjectService.remove(projectId);
    } catch (error: any) {
      throw error;
    }
  }
}
