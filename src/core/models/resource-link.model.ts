export default interface ResourceLink {
  _id?: string;
  title: string;
  url: number;
  public: boolean;
  type: string;
  project?: string;
}
