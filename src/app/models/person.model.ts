export enum Role {
  USER = 'User',
  ADMIN = 'Admin'
}

export interface Person {
    id: number;
    email: string;
    password: string;
    role: Role;
}