import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { upsertUser } from "@/lib/data/users";

const protectedPathPrefixes = [
  "/dashboard",
  "/history",
  "/profile",
  "/workouts",
];

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email && user.id) {
        const provisionedUser = await upsertUser({
          email: user.email,
          id: user.id,
          imageUrl: user.image ?? null,
          name: user.name ?? null,
        });
        token.sub = provisionedUser.id;
      }

      return token;
    },
    async authorized({ auth: session, request }) {
      const isProtectedPath = protectedPathPrefixes.some((pathPrefix) =>
        request.nextUrl.pathname.startsWith(pathPrefix),
      );

      return isProtectedPath ? Boolean(session?.user?.id) : true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
});
