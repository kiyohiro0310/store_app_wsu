import { dataResponse } from "@/functions/res/data_response";
import { errorResponse } from "@/functions/res/error_response";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Use PrismaClient as a singleton to prevent connection issues in production
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user || user == null) {
      return errorResponse(401, "User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return errorResponse(401, "Invalid password");
    }

    return dataResponse(200, user);
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(500, "Internal server error");
  }
}
