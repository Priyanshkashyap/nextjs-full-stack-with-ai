import { resend } from "../lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {

  try {
    console.log("1. Entered sendVerificationEmail");

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({
        username,
        otp: verifyCode,
      }),
    });

    console.log("2. Resend returned:");
    console.log(response);

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.log("3. Entered catch");
    console.error(error);

    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}