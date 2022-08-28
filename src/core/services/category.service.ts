import generate from 'nanoid/generate';
import { CategoryModel } from '../../infrastructure/database/schemas/category.schema';
import CustomError from '../../infrastructure/models/error.model';
import Category from '../models/category.model';

export class CategoryService {
  public static async create(category: Category): Promise<Category> {
    category.nanoId = generate('0123456789abcdefghijklmnopqrstuvwxyz', 10);
    const newCategory: Category = await CategoryModel.create(category);
    return newCategory;
  }

  public static async get(categoryId: string): Promise<Category> {
    try {
      const category: Category = await CategoryModel.findById(categoryId).lean();
      if (!category) {
        throw CustomError.CATEGORY_NOT_FOUND;
      }
      return category;
    } catch (error: any) {
      throw error;
    }
  }

  public static async getAll(page: number, limit: number): Promise<any> {
    const offset: number = (page - 1) * limit;
    const result: any = await CategoryModel.find().skip(offset).limit(limit);
    const categories: Category[] = result;
    const totalItems: number = await CategoryModel.countDocuments();
    return { totalItems, limit, page, categories };
  }

  public static async update(categoryId: string, categoryData: Category): Promise<Category> {
    try {
      const category: Category = await CategoryModel.findById(categoryId).lean();
      if (!category) {
        throw CustomError.CATEGORY_NOT_FOUND;
      }
      const updatedCategory: Category = await CategoryModel.findByIdAndUpdate(
        category._id,
        categoryData
      ).lean();
      return updatedCategory;
    } catch (error: any) {
      throw error;
    }
  }
}
