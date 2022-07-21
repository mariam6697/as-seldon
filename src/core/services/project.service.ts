import { ProjectModel } from '../../infrastructure/database/schemas/project.schema';
import CustomError from '../../infrastructure/models/error.model';
import Project, { Semester } from '../models/project.model';

export class ProjectService {
  public static async create(project: Project): Promise<Project> {
    const semester: Semester =
      project.semester == '1' ? Semester.one : project.semester == '2' ? Semester.two : null;
    project.semester = semester;
    const newProject: Project = await ProjectModel.create(project);
    return newProject;
  }

  public static async get(projectId: string): Promise<Project> {
    try {
      const project: Project = await ProjectModel.findById(projectId)
        .populate('mainImage')
        .populate('extraImages')
        .lean();
      if (!project) {
        throw CustomError.PROJECT_NOT_FOUND;
      }
      return project;
    } catch (error: any) {
      throw error;
    }
  }

  public static async getAll(page: number, limit: number, search: string): Promise<any> {
    const offset: number = (page - 1) * limit;
    let query: any = {};
    if (search) {
      const searchRegexp: any = { $regex: search, $options: 'i' };
      query['$and'].push({
        $or: [{ name: searchRegexp }, { year: searchRegexp }]
      });
    }
    const result: any = await ProjectModel.find(query).skip(offset).limit(limit);
    const projects: Project[] = result;
    const totalItems: number = await ProjectModel.countDocuments(query);
    return { totalItems, limit, page, projects };
  }

  public static async update(projectId: string, projectData: Project): Promise<Project> {
    try {
      const project: Project = await ProjectModel.findById(projectId);
      if (!project) {
        throw CustomError.PROJECT_NOT_FOUND;
      }
      const updatedProject: Project = await ProjectModel.findByIdAndUpdate(
        project._id,
        projectData
      ).lean();
      return updatedProject;
    } catch (error: any) {
      throw error;
    }
  }
}
