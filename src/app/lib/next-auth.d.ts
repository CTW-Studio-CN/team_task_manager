import 'next-auth';

import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      backgroundImage?: string | null;
    };
  }

  interface User {
    id: string;
    role?: string | null;
    backgroundImage?: string | null;
  }
}
