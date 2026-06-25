export interface IUser {
  name: string;
  email: string;
  password: string;
  is_active?: boolean;
  age: number;
  role?: "user" | "admin" | "agent";
}
