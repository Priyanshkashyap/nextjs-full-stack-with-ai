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
        identifier: {
        label: "Email or Username", // this part could be something else too 
        type: "text"
         },
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
};