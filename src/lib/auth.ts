import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AUTHORITY_ROLES } from '@/data/keralaData';
import { AuthorityRole } from '@/types/grievance';

export const authOptions: NextAuthOptions = {
  providers: [
    // 1. Citizen / Civilian Login Provider
    CredentialsProvider({
      id: 'citizen-login',
      name: 'Citizen Login',
      credentials: {
        phone: { label: 'Phone Number', type: 'text', placeholder: '+91 94470 XXXXX' },
        name: { label: 'Citizen Name', type: 'text', placeholder: 'K. Suresh Kumar' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.name) {
          return null;
        }

        const phone = credentials.phone.trim();
        const name = credentials.name.trim();

        return {
          id: `citizen-${phone.replace(/\D/g, '') || Date.now()}`,
          name: name,
          email: `${phone.replace(/\D/g, '')}@citizen.lsgkerala.gov.in`,
          userType: 'CITIZEN' as const,
          phone: phone,
          panchayat: 'Venganoor Grama Panchayat',
          wardNumber: 7,
        };
      },
    }),

    // 2. Panchayat Officer / Admin Login Provider
    CredentialsProvider({
      id: 'admin-login',
      name: 'Authority Login',
      credentials: {
        officerRole: { label: 'Authority Role', type: 'text' },
        employeeCode: { label: 'Employee Code (PEN)', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.officerRole) {
          return null;
        }

        const targetRole = credentials.officerRole as AuthorityRole;
        const officer = AUTHORITY_ROLES.find(o => o.role === targetRole) || AUTHORITY_ROLES[1];

        return {
          id: `officer-${targetRole.toLowerCase()}`,
          name: officer.defaultOfficialEn,
          email: `${targetRole.toLowerCase()}@lsgkerala.gov.in`,
          userType: 'OFFICER' as const,
          role: targetRole,
          designationEn: officer.nameEn,
          designationMl: officer.nameMl,
          panchayat: 'Grama Panchayat Headquarters',
          phone: '+91 471 2345678',
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userType = user.userType;
        token.role = user.role;
        token.phone = user.phone;
        token.designationEn = user.designationEn;
        token.designationMl = user.designationMl;
        token.panchayat = user.panchayat;
        token.wardNumber = user.wardNumber;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.userType = token.userType;
        session.user.role = token.role;
        session.user.phone = token.phone;
        session.user.designationEn = token.designationEn;
        session.user.designationMl = token.designationMl;
        session.user.panchayat = token.panchayat;
        session.user.wardNumber = token.wardNumber;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET || 'parathipetty_kerala_lsgd_nextauth_secret_key_2026_super_secure',
};
