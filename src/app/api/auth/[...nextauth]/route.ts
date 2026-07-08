//If you have: app/api/auth/[...nextauth]/route.ts.then all of these URLs go to the same route.ts: eg. /api/auth/signout,/api/auth/signin
import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };