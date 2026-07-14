import { sendMessageSchema } from "@/src/schemas/sendMessageSchema";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { Message } from "@/src/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const result = sendMessageSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
         message: result.error.issues[0]?.message || "Invalid request body",
        },
        { status: 400 }
      );
    }

    const { username, content } = result.data;

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error adding message", error);

    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}