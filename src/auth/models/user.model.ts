export default interface User {
  _id?: string;
  role: string;
  email: string;
  name: string;
  surname: string;
  password?: string;
  enabled: boolean;
}
