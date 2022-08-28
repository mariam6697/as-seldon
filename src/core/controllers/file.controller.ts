import { isValidObjectId } from 'mongoose';
import { Body, Delete, Path, Post, Route, Tags } from 'tsoa';
import CustomError from '../../infrastructure/models/error.model';
import MiscUtils from '../../infrastructure/utils/misc.utils';
import File from '../models/file.model';
import Project from '../models/project.model';
import { FileService } from '../services/file.service';
import { ProjectService } from '../services/project.service';

@Tags('Core')
@Route(`core/files`)
export class FileController {
  /**
   * Uploads a new main image for a project. Deletes old main image if neeeded.
   */
  @Post('/project/main/:projectId')
  public static async addProjectMainImage(
    @Body() fileData: File,
    @Path() projectId: string
  ): Promise<File> {
    try {
      const required: string[] = ['extension', 'size', 'type', 'base64'];
      const hasRequiredData: boolean = MiscUtils.checkRequired(fileData, required);
      if (!hasRequiredData) {
        throw CustomError.REQUIRED_DATA;
      }
      const project: Project = await ProjectService.get({ projectId });
      if (project.mainImage) {
        await FileService.delete(project.mainImage);
        delete project.mainImage;
      }
      const file: File = await FileService.create(fileData);

      await ProjectService.update(projectId, { ...project, mainImage: file._id });

      return file;
    } catch (error: any) {
      throw error;
    }
  }

  @Post('/project/extra/:projectId')
  public static async addProjectExtraImage(
    @Body() fileData: File,
    @Path() projectId: string
  ): Promise<File> {
    try {
      const required: string[] = ['extension', 'size', 'type', 'base64'];
      const hasRequiredData: boolean = MiscUtils.checkRequired(fileData, required);
      if (!hasRequiredData) {
        throw CustomError.REQUIRED_DATA;
      }
      const project: Project = await ProjectService.get({ projectId });
      const file: File = await FileService.create(fileData);

      const extraImages: string[] = project.extraImages
        ? [...project.extraImages, file._id]
        : [file._id];
      await ProjectService.update(projectId, {
        ...project,
        extraImages: extraImages
      });

      return file;
    } catch (error: any) {
      throw error;
    }
  }

  @Delete('/:fileId')
  public static async delete(@Path() fileId: string): Promise<void> {
    try {
      await FileService.delete(fileId);
    } catch (error: any) {
      throw error;
    }
  }
}
