export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/workouts/:path*",
  ],
};
