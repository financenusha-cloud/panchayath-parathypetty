import { DefaultSession, DefaultUser } from 'next-auth';
import { AuthorityRole } from './grievance';

export type UserType = 'CITIZEN' | 'OFFICER';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    userType: UserType;
    role?: AuthorityRole;
    phone?: string;
    designationEn?: string;
    designationMl?: string;
    panchayat?: string;
    wardNumber?: number;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      userType: UserType;
      role?: AuthorityRole;
      phone?: string;
      designationEn?: string;
      designationMl?: string;
      panchayat?: string;
      wardNumber?: number;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    userType: UserType;
    role?: AuthorityRole;
    phone?: string;
    designationEn?: string;
    designationMl?: string;
    panchayat?: string;
    wardNumber?: number;
  }
}
