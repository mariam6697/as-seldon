import { Get, Path, Query, Route, Tags } from 'tsoa';
import { ProjectService } from '../../core/services/project.service';

/**
 * Module with admin-only endpoints.
 */
@Tags('Admin')
@Route(`admin/projects`)
export class ProjectController {
  /**
   * Retrieves data from a project given its ID
   */
  @Get('/{projectId}')
  public static async get(@Path() projectId: string): Promise<any> {
    try {
      const response: any = await ProjectService.get({ projectId });
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
    @Query() search?: string
  ): Promise<any> {
    try {
      const result: any = await ProjectService.getAll(page, limit, {}, '', search);
      return result;
    } catch (error: any) {
      throw error;
    }
  }
}
