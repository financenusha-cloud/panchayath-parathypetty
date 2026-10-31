import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protecting Authority Dashboard: only authenticated OFFICERS are permitted
    if (path.startsWith('/authority')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login?tab=OFFICER&callbackUrl=' + encodeURIComponent(path), req.url));
      }
      if (token.userType !== 'OFFICER') {
        return NextResponse.redirect(new URL('/login?tab=OFFICER&error=OfficerAccessRequired', req.url));
      }
    }

    // Protecting Citizen Petitions: requires user login
    if (path.startsWith('/my-petitions')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login?tab=CITIZEN&callbackUrl=' + encodeURIComponent(path), req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // handled manually above to permit selective redirects
    },
  }
);

export const config = {
  matcher: ['/authority/:path*', '/my-petitions/:path*'],
};
