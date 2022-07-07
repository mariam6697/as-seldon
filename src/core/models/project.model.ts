import Category from './category.model';

export default interface Project {
  _id?: string;
  name: string;
  description?: string;
  semester?: Semester;
  year?: string;
  categories?: any[] | Category[];
  updates?: ProjectUpdate[];
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
