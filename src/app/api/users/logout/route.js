import { connectDB } from "@/dbconfig/dbconfig.js";
import { NextResponse } from "next/server";

// Connect to the database
connectDB();

export async function GET(request) {
  try {
    const response = NextResponse.json({
      message: "Logout Successfully",
      success: true,
    });

    // Clear the cookie by setting an expired date and path
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/", // Ensure the path is the same as where the token was initially set
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
