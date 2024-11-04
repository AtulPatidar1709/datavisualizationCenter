import { connectDB } from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";

// Connect to the database (if required for session management)
connectDB();

export async function GET(request) {
  try {
    // Prepare the response
    const response = NextResponse.json({
      message: "Logout Successfully",
      success: true,
    });
    // Clear the token cookie by setting it to expire
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure secure flag is used in production
      expires: new Date(0), // Expire the cookie immediately
      path: "/login", // Ensure path matches where the cookie was set
    });

    return response;
  } catch (error) {
    // Handle any errors
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
