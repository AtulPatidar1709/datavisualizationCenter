import { connectDB } from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

connectDB(); // Connect to the database

// Get user details
export async function POST(request) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not found from token" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid User" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User found", data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/users/me:", error);
    return NextResponse.json(
      { success: false, error: error.message, message: "User Not Found" },
      { status: 500 }
    );
  }
}

// Update user interests
export async function PUT(request) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not found from token" },
        { status: 400 }
      );
    }

    const { interests } = await request.json();

    const user = await User.findByIdAndUpdate(
      userId,
      { interests },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid User" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User interests updated successfully",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    // console.error("Error in PUT /api/users/me:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: "Failed to update interests",
      },
      { status: 500 }
    );
  }
}
