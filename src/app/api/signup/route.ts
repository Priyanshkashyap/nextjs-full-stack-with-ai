import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Check if verified username already exists
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // Check existing user by email
    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    // Generate verify code(otp)
    const verifyCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (existingUserByEmail) {

      // If user already exists and verified
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );

      } else {

        // Update old unverified user
        const hashedPassword = await bcrypt.hash(password, 10);

        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );

        await existingUserByEmail.save();
      }

    } else {

      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      { status: 201 }
    );

  } catch (error) {

    console.error("Error registering user", error);

    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}