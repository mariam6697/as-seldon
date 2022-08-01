import Category from './category.model';

export default interface Project {
  _id?: string;
  name: string;
  description?: string;
  highlighted?: boolean;
  visible?: boolean;
  semester?: Semester;
  year?: string;
  categories?: string[];
  updates?: string[];
  mainImage?: string;
  extraImages?: string[];
}

export interface ProjectUpdate {
  _id?: string;
  title: string;
  description: string;
  date: Date;
}

export enum Semester {
  one = '1',
  two = '2'
}
