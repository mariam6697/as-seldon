import { ProjectUpdateModel } from '../../infrastructure/database/schemas/project-update.schema';
import { ProjectUpdate } from '../models/project.model';

export class ProjectUpdateService {
  public static async create(
    projectId: string,
    projectUpdate: ProjectUpdate
  ): Promise<ProjectUpdate> {
    projectUpdate.project = projectId;
    const newProjectUpdate: ProjectUpdate = await ProjectUpdateModel.create(projectUpdate);
    return newProjectUpdate;
  }

  public static async getByProjectId(projectId: string, page: number, limit: number): Promise<any> {
    const offset: number = (page - 1) * limit;
    const result: any = await ProjectUpdateModel.find({ project: projectId })
      .skip(offset)
      .limit(limit);
    const projectUpdates: ProjectUpdate[] = result;
    const totalItems: number = await ProjectUpdateModel.countDocuments({ project: projectId });
    return { totalItems, limit, page, projectUpdates };
  }
}
