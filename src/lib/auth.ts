import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AUTHORITY_ROLES } from '@/data/keralaData';
import { AuthorityRole } from '@/types/grievance';

export const authOptions: NextAuthOptions = {
  providers: [
    // 1. Citizen / Civilian Login & Signup Provider
    CredentialsProvider({
      id: 'citizen-login',
      name: 'Citizen Login',
      credentials: {
        phone: { label: 'Phone Number', type: 'text', placeholder: '+91 94470 XXXXX' },
        name: { label: 'Citizen Name', type: 'text', placeholder: 'K. Suresh Kumar' },
        panchayat: { label: 'Panchayat', type: 'text' },
        wardNumber: { label: 'Ward Number', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.name) {
          return null;
        }

        const phone = credentials.phone.trim();
        const name = credentials.name.trim();
        const panchayat = credentials.panchayat?.trim() || 'Venganoor Grama Panchayat';
        const wardNumber = credentials.wardNumber ? Number(credentials.wardNumber) : 7;

        return {
          id: `citizen-${phone.replace(/\D/g, '') || Date.now()}`,
          name: name,
          email: `${phone.replace(/\D/g, '')}@citizen.lsgkerala.gov.in`,
          userType: 'CITIZEN' as const,
          phone: phone,
          panchayat: panchayat,
          wardNumber: wardNumber,
        };
      },
    }),

    // 2. Panchayat Officer / Admin Login & Signup Provider
    CredentialsProvider({
      id: 'admin-login',
      name: 'Authority Login',
      credentials: {
        officerRole: { label: 'Authority Role', type: 'text' },
        employeeCode: { label: 'Employee Code (PEN)', type: 'text' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Officer Name', type: 'text' },
        panchayat: { label: 'Panchayat', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.officerRole) {
          return null;
        }

        const targetRole = credentials.officerRole as AuthorityRole;
        const officer = AUTHORITY_ROLES.find(o => o.role === targetRole) || AUTHORITY_ROLES[1];
        const officialName = credentials.name?.trim() || officer.defaultOfficialEn;
        const panchayatName = credentials.panchayat?.trim() || 'Grama Panchayat Headquarters';

        return {
          id: `officer-${targetRole.toLowerCase()}-${Date.now().toString().slice(-4)}`,
          name: officialName,
          email: `${targetRole.toLowerCase()}@lsgkerala.gov.in`,
          userType: 'OFFICER' as const,
          role: targetRole,
          designationEn: officer.nameEn,
          designationMl: officer.nameMl,
          panchayat: panchayatName,
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
