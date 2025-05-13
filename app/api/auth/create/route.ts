import { errorResponse } from "@/functions/res/error_response";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";


export async function POST(request: Request) {
  const { username, email, password } = await request.json();
  const prismaClient = new PrismaClient();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await prismaClient.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return errorResponse(409, "User already exists");
    }
    // Create a new user
    const user = await prismaClient.user.create({
      data: {
        name: username,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return errorResponse(500, "Internal Server Error");
  }
}