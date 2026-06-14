//giving control to next auth
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({ // our own custom one not github/google
      id: "credentials",
      name: "Credentials",

      credentials: { // will generate a default form with details to be given
        /*identifier: {
        label: "Email or Username", // this part could be something else too 
        type: "text"
         },*/
         email: {
        label: "Email ", 
        type: "text"
        }
         ,
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials: any): Promise<any> { // the credentials in the form will come here
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [ // mongodb query operator
              { email: credentials.identifier }, 
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error(
              "Please verify your account before login"
            );
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password, 
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (err: any) {
          throw err;
        }
      },
    }),
  ],
   
   callbacks:{ // all these functions should return exactly these only
    async jwt({ token, user }) { // both are converted to next-auth user object here. token object is created automatically
    if (user) { // initially next auth doesnt accept _id ,isVerified,etc as an input but our db has them so we make a d.ts file to make exceptions
      token._id = user._id?.toString(); // these properties can be added easily here
      token.isVerified = user.isVerified;
      token.isAcceptingMessages = user.isAcceptingMessages;
      token.username = user.username;
    }
    return token;
  },
    async session({ session,token }) {
      if (token) {
      session.user._id = token._id;
      session.user.isVerified = token.isVerified;
      session.user.isAcceptingMessages = token.isAcceptingMessages;
      session.user.username = token.username;
    }
      return session;
    },
   },
   session: {
    strategy: "jwt",
  },
pages: { // next auth designs its own sigm up/sign in pages 
    signIn: '/signin',
   },
  secret: process.env.NEXTAUTH_SECRET,
};