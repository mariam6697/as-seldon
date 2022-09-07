import { RepositoryModel } from '../../infrastructure/database/schemas/repository.schema';
import GitHubUtils from '../../infrastructure/utils/github.utils';
import {
  RemoteBlob,
  RemoteCommit,
  RemoteFile,
  RemoteRepo,
  RemoteTree
} from '../models/remote.model';
import Project from '../models/project.model';
import Repository from '../models/repository.model';

export class RepositoryService {
  public static async create(project: Project): Promise<Repository> {
    const name: string = `${Date.now()}-${project.name.toLowerCase().split(' ').join('-')}`;
    const ghRepo: RemoteRepo = await GitHubUtils.createRepo({
      name: name,
      description: project.shortDescription ? project.shortDescription : '',
      autoInit: true,
      private: true
    });
    const newRepo: Repository = await RepositoryModel.create({
      name: name,
      url: ghRepo.html_url,
      project: project._id,
      id: ghRepo.id
    });
    return newRepo;
  }

  public static async get(data: {
    projectId?: string;
    repositoryId?: string;
  }): Promise<Repository> {
    const query: any = data.projectId ? { project: data.projectId } : { _id: data.repositoryId };
    const repo: Repository = await RepositoryModel.findOne(query).lean();
    return repo;
  }

  public static async updateRemoteRepo(repo: Repository, files: any[]): Promise<void> {
    if (files.length > 0) {
      // Check root foolder
      const root: string = files[0].path.split('/')[0];
      const rootFolder: boolean = files.every((file: any) => file.path.split('/')[0] == root);

      if (rootFolder) {
        files.forEach((file: RemoteFile) => {
          file.path = file.path.slice(root.length + 1, file.path.length);
        });
      }

      // Create blobs
      let treeData: any[] = [];
      for (let i = 0; i < files.length; i++) {
        const file: RemoteFile = files[i];
        const blob: RemoteBlob = await GitHubUtils.createBlob({
          name: repo.name,
          base64: file.fileData.base64
        });
        treeData.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha });
      }

      // Create tree
      const tree: RemoteTree = await GitHubUtils.createTree({ name: repo.name, tree: treeData });

      // Get last commit
      const lastCommit: RemoteCommit = await GitHubUtils.getLastCommit({
        name: repo.name,
        branch: 'main'
      });

      // Create commit
      const commit: RemoteCommit = await GitHubUtils.createCommit({
        name: repo.name,
        message: 'Uploading project files',
        treeSha: tree.sha,
        parentSha: lastCommit.sha
      });

      // Update ref
      await GitHubUtils.updateReference({
        name: repo.name,
        sha: commit.sha,
        branch: 'main'
      });
    }
  }
}
