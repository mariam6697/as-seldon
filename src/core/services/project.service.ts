import { ProjectModel } from '../../infrastructure/database/schemas/project.schema';
import Project, { Semester } from '../models/project.model';

export class ProjectService {
  public static async create(project: Project): Promise<Project> {
    const semester: Semester =
      project.semester == '1' ? Semester.one : project.semester == '2' ? Semester.two : null;
    project.semester = semester;
    const newProject: Project = await ProjectModel.create(project);
    return newProject;
  }
}
