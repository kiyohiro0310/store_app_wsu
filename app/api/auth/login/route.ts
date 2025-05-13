import { dataResponse } from "@/functions/res/data_response";
import { errorResponse } from "@/functions/res/error_response";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const prisma = new PrismaClient();
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
}
