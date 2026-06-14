// docs for this there in next auth me search types
import "next-auth";
//Hey, NextAuth's default User, Session, and JWT objects will contain some extra fields in my application
declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession["user"]; // user should be always a type inside session even though everything inside the user part is null
  }
}
declare module "next-auth/jwt" { // just different way to write same thing
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}