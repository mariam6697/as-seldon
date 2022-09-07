import { Body, Post, Route, Tags } from 'tsoa';
import CustomError from '../../infrastructure/models/error.model';
import MiscUtils from '../../infrastructure/utils/misc.utils';
import Project from '../models/project.model';
import Repository from '../models/repository.model';
import { ProjectService } from '../services/project.service';
import { RepositoryService } from '../services/repository.service';

@Tags('Core')
@Route(`core/repositories`)
export class RepositoryController {
  /**
   * Creates a new project repository in the database.
   */
  @Post('/')
  public static async create(
    @Body() data: { repoData: Repository; files: any[] }
  ): Promise<Repository> {
    try {
      const required: string[] = ['project'];
      const hasRequiredData: boolean = MiscUtils.checkRequired(data.repoData, required);
      if (!hasRequiredData) {
        throw CustomError.REQUIRED_DATA;
      }

      const project: Project = await ProjectService.get({ projectId: data.repoData.project });

      // Check if project has a repository
      const existingRepo: Repository = await RepositoryService.get({
        projectId: data.repoData.project
      });

      if (existingRepo) {
        throw CustomError.EXISTING_REPO;
      }

      // Create remote repository
      const repo: Repository = await RepositoryService.create(project);

      // Upload files to remote repo
      await RepositoryService.updateRemoteRepo(repo, data.files);

      return repo;
    } catch (error: any) {
      throw error;
    }
  }
}
