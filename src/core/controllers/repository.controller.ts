import { Body, Delete, Get, Path, Post, Route, Tags } from 'tsoa';
import CustomError from '../../infrastructure/models/error.model';
import Project from '../models/project.model';
import { RemoteFile } from '../models/remote.model';
import Repository from '../models/repository.model';
import { ProjectService } from '../services/project.service';
import { RepositoryService } from '../services/repository.service';

@Tags('Core > Repositories')
@Route(`core/repositories`)
export class RepositoryController {
  /**
   * Creates a new project repository in the database
   */
  @Post('/:projectId')
  public static async create(
    @Path() projectId: string,
    @Body() data: { files: RemoteFile[]; private: boolean }
  ): Promise<Repository> {
    try {
      if (!projectId || !data.files) {
        throw CustomError.REQUIRED_DATA;
      }
      const project: Project = await ProjectService.get({ projectId });

      // Check if project has a repository
      const existingRepo: Repository = await RepositoryService.get({
        projectId
      });

      if (existingRepo) {
        throw CustomError.EXISTING_REPO;
      }

      // Create remote repository
      const repo: Repository = await RepositoryService.create(project, data.private);

      // Upload files to remote repo
      await RepositoryService.updateRemoteRepo(repo, data.files);

      return repo;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Gets a repository by its project ID
   */
  @Get('/:projectId')
  public static async getByProjectId(@Path() projectId: string): Promise<Repository[]> {
    try {
      const project: Project = await ProjectService.get({ projectId });
      const repos: Repository[] = await RepositoryService.getByProject({ projectId: project._id });
      if (!repos) {
        return [];
      }
      return repos;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Deletes a repository given its ID
   */
  @Delete('/:repositoryId')
  public static async remove(@Path() repositoryId: string): Promise<void> {
    try {
      await RepositoryService.remove(repositoryId);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Deletes all remote repos (debug)
   */
  @Delete('/')
  public static async removeAll(): Promise<void> {
    try {
      await RepositoryService.removeAll();
    } catch (error: any) {
      throw error;
    }
  }
}
