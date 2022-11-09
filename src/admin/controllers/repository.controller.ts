import { Body, Delete, Get, Path, Post, Route, Tags } from 'tsoa';
import Project from '../../core/models/project.model';
import Repository from '../../core/models/repository.model';
import { ProjectService } from '../../core/services/project.service';
import { RepositoryService } from '../../core/services/repository.service';
import CustomError from '../../infrastructure/models/error.model';

@Tags('Core > Repositories')
@Route(`core/repositories`)
export class RepositoryController {
  /**
   * Gets all repositories by its project ID
   */
  @Get('/:projectId')
  public static async getByProjectId(@Path() projectId: string): Promise<Repository[]> {
    try {
      const project: Project = await ProjectService.get({ projectId });
      const repos: Repository[] = await RepositoryService.getByProject({
        projectId: project._id,
        private: null
      });
      if (!repos) {
        return [];
      }
      return repos;
    } catch (error: any) {
      throw error;
    }
  }
}
