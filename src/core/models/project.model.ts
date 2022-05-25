import { ObjectId } from 'mongoose';
import Category from './category.model';

export default interface Project {
  _id?: string;
  name: string;
  description?: string;
  semester?: Semester;
  year?: string;
  categories?: ObjectId[] | Category[];
  updates?: ProjectUpdate[];
}

export interface ProjectUpdate {
  _id?: string;
  title: string;
  descripcion: string;
  date: Date;
}

export enum Semester {
  one = '1',
  two = '2'
}
