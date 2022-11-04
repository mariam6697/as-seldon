export default interface ResourceLink {
  _id?: string;
  title: string;
  description: string;
  url: number;
  public: boolean;
  type: string;
  project?: string;
}
