export default interface Repository {
  _id?: string;
  name: string;
  url?: string;
  id?: number;
  private?: boolean;
  project: string;
}
