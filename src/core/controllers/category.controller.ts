import { Body, Get, Path, Post, Put, Query, Route, Tags } from 'tsoa';
import CustomError from '../../infrastructure/models/error.model';
import MiscUtils from '../../infrastructure/utils/misc.utils';
import Category from '../models/category.model';
import { CategoryService } from '../services/category.service';

@Tags('Core > Categories')
@Route(`core/categories`)
export class CategoryController {
  /**
   * Creates a new project category in the database
   */
  @Post('/')
  public static async create(@Body() categoryData: Category): Promise<Category> {
    try {
      const required: string[] = ['name', 'label'];
      const hasRequiredData: boolean = MiscUtils.checkRequired(categoryData, required);
      if (!hasRequiredData) {
        throw CustomError.REQUIRED_DATA;
      }
      const category: Category = await CategoryService.create(categoryData);
      return category;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Retrieves data from a category given its ID
   */
  @Get('/{categoryId}')
  public static async get(@Path() categoryId: string): Promise<Category> {
    try {
      if (!categoryId) {
        throw CustomError.REQUIRED_DATA;
      }
      const response: any = await CategoryService.get(categoryId);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Retrieves data from a category given its unique label
   */
  @Get('/label/{categoryLabel}')
  public static async getByLabel(@Path() categoryLabel: string): Promise<Category> {
    try {
      if (!categoryLabel) {
        throw CustomError.REQUIRED_DATA;
      }
      const response: any = await CategoryService.getByLabel(categoryLabel);
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Gets a paginated list with all the categories
   */
  @Get('/')
  public static async getAll(@Query() page: number, @Query() limit: number): Promise<any> {
    try {
      page = page ?? 1;
      limit = limit ?? 10;
      const result: any = await CategoryService.getAll(page, limit);
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Update a category data given its ID
   */
  @Put('/{categoryId}')
  public static async update(
    @Path() categoryId: string,
    @Body() categoryData: Category
  ): Promise<Category> {
    try {
      if (!categoryId || !categoryData) {
        throw CustomError.REQUIRED_DATA;
      }
      const category: Category = await CategoryService.update(categoryId, categoryData);
      return category;
    } catch (error: any) {
      throw error;
    }
  }
}
