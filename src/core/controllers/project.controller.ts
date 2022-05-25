import { NextFunction, Request, Response } from 'express';
import CustomError from '../../infrastructure/models/error.model';
import MiscUtils from '../../infrastructure/utils/misc.utils';
import Project from '../models/project.model';
import { ProjectService } from '../services/project.service';

export class ProjectController {
  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectData: Project = req.body;
      const required: string[] = ['name'];
      const hasRequiredData: boolean = MiscUtils.checkRequired(projectData, required);
      if (!hasRequiredData) {
        throw CustomError.REQUIRED_DATA;
      }
      const project: Project = await ProjectService.create(projectData);
      res.status(200).json({ status: 'ok', data: project });
    } catch (error: any) {
      next(error);
    }
  }
}
