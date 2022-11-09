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
    @Body() data: { files: RemoteFile[]; private: boolean; label: string }
  ): Promise<Repository> {
    try {
      if (!projectId || !data.files) {
        throw CustomError.REQUIRED_DATA;
      }
      const project: Project = await ProjectService.get({ projectId });

      // Create remote repository
      const repo: Repository = await RepositoryService.create(project, data.private, data.label);

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
  @Get('/:projectNanoId')
  public static async getByProjectId(@Path() projectNanoId: string): Promise<Repository[]> {
    try {
      const project: Project = await ProjectService.get({ projectNanoId });
      const repos: Repository[] = await RepositoryService.getByProject({
        projectId: project._id,
        private: false
      });
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
