import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";

export async function GET(
  _request: Request,
  { params }: { params: { username: string } }
) {
  await dbConnect();

  try {
    const username = decodeURIComponent(params.username);

    const user = await UserModel.findOne({ username }).select(
      "username isAcceptingMessage"
    );

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        username: user.username,
        isAcceptingMessage: user.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching public user profile", error);

    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}