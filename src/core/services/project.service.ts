import generate from 'nanoid/generate';
import { ProjectModel } from '../../infrastructure/database/schemas/project.schema';
import CustomError from '../../infrastructure/models/error.model';
import Project, { Semester } from '../models/project.model';

export class ProjectService {
  public static async create(project: Project): Promise<Project> {
    project.nanoId = generate('0123456789abcdefghijklmnopqrstuvwxyz', 10);
    let semester: Semester = null;
    if (project.semester == '1') {
      semester = Semester.one;
    } else if (project.semester == '2') {
      semester = Semester.two;
    } else {
      throw CustomError.NOT_VALID_VALUE;
    }
    project.semester = semester;
    const newProject: Project = await ProjectModel.create(project);
    return newProject;
  }

  public static async get(data: {
    projectId?: string;
    projectNanoId?: string;
    select?: string;
  }): Promise<Project> {
    try {
      data.select = data.select || '';
      const query: any = data.projectId ? { _id: data.projectId } : { nanoId: data.projectNanoId };
      const project: Project = await ProjectModel.findOne(query, data.select)
        .populate('mainImage')
        .populate('extraImages')
        .populate('categories')
        .lean();
      if (!project) {
        throw CustomError.PROJECT_NOT_FOUND;
      }
      return project;
    } catch (error: any) {
      throw error;
    }
  }

  public static async getAll(
    page: number,
    limit: number,
    query: any,
    select?: string,
    cat?: string[],
    semester?: string,
    year?: string
  ): Promise<any> {
    const offset: number = (page - 1) * limit;
    select = select || '';
    if (cat && cat.length > 0) {
      query['$and'] = query['$and'] ? query['$and'] : [];
      query['$and'].push({
        categories: {
          $all: cat
        }
      });
    }
    if (semester) {
      query['$and'] = query['$and'] ? query['$and'] : [];
      query['$and'].push({
        semester
      });
    }
    if (year) {
      query['$and'] = query['$and'] ? query['$and'] : [];
      query['$and'].push({
        year
      });
    }
    const result: any = await ProjectModel.find(query, select)
      .populate('mainImage')
      .populate('categories')
      .skip(offset)
      .limit(limit);
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

  public static async remove(projectId: string): Promise<void> {
    try {
      const project: Project = await ProjectModel.findById(projectId);
      if (!project) {
        throw CustomError.PROJECT_NOT_FOUND;
      }
      await ProjectModel.findByIdAndDelete(projectId);
    } catch (error: any) {
      throw error;
    }
  }
}
