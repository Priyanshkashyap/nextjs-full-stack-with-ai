import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";
export async function POST(request: Request) {
    await dbConnect();

    try {

        const { username, email, password } = await request.json();

    } catch (error) {

        console.error("Error registering user", error);

        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        );
    }
}