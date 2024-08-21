export interface User {
    id: number;
    token: string;
    email: string;
    username: string;
    password: string;
    phone: string;
    image?: string;
    role: string;
  }

  export interface Users {
    id: number;
    email: string;
    username: string;
    password: string;
    phone?: string;
    image?: string;
    roleId: number;
  }

  export interface Roles {
    id: number;
    name: string;
  }
  