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
    async signIn({ user }) {
      if (!user.id || !user.email) {
        return false;
      }

      try {
        await upsertUser({
          email: user.email,
          id: user.id,
          imageUrl: user.image ?? null,
          name: user.name ?? null,
        });
        return true;
      } catch {
        return false;
      }
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
