import { connectDB } from "@/dbconfig/dbconfig";
import User from "@/models/user";
import { NextResponse } from "next/server";

connectDB(); // Connect to the database

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { enteredOtp } = reqBody;

    // Find user by OTP
    const user = await User.findOne({
      verifyToken: enteredOtp,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid or expired OTP",
        },
        { status: 400 }
      );
    }

    // Update user verification status
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Email Verified Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
