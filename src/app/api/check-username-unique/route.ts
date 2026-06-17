import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { z } from "zod";
import { usernameValidation } from "@/src/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url); //getting from all the query parameters

    const queryParam = {
      username: searchParams.get("username"),
    };

    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    console.log(result); // TODO: remove
/* result will have either success or error,  result.error.format() will give below part..format() is a Zod method that converts a complicated ZodError into a nested object structure that matches your schema.
{
  _errors: [],
  username: {
    _errors: [
      "String must contain at least 3 character(s)"
    ]
  }
}*/

    if (!result.success) {
      const usernameErrors =
        result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

  } catch (error) {
    console.error("Error checking username", error);

    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}