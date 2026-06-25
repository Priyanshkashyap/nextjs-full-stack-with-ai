import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id); // in aggregation pipelines approach u need userid to be exactly mongodb user object type

  try {
    const user = await UserModel.aggregate([ // Think of aggregation as a pipeline where MongoDB takes documents and passes them through a series of stages.
      {
        $match: { // It filters and keeps only the logged-in user's document.
          _id: userId,
        },
      },
      {
        $unwind: "$messages",// MongoDB takes every element inside the messages array and creates a separate document for it.Now MongoDB can work on each message individually.
      },
      {
        $sort: {
          "messages.createdAt": -1, //Sort all the documents in decreasing order produced by $unwind.here its date based
        },
      },
      {
        $group: { //Group all documents having the same user id. for any aggregate pipeline first destructing has to be done
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  }
   catch (error) {
    console.error("Error fetching messages:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch messages",
      },
      { status: 500 }
    );
  }
}