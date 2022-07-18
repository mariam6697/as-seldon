import { ObjectId } from 'mongoose';
import { FileModel } from '../../infrastructure/database/schemas/file.schema';
import CustomError from '../../infrastructure/models/error.model';
import File from '../models/file.model';

export class FileService {
  public static async create(fileData: File): Promise<File> {
    const file: File = await FileModel.create(fileData);
    return file;
  }

  public static async delete(fileId: string): Promise<void> {
    const file: File = await FileModel.findById(fileId).lean();
    if (!file) {
      throw CustomError.FILE_NOT_FOUND;
    }
    await FileModel.findByIdAndDelete(fileId);
  }
}
