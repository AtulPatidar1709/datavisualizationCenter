import { connectDB } from "@/dbconfig/dbconfig";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

connectDB(); // Connect to the database

export async function POST(request) {
  try {
    const reqBody = await request.json();

    const { name, email, password } = reqBody;

    // Check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Send a verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    // Return success response
    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      savedUser,
    });
  } catch (error) {
    // Handle errors and return an error response
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
