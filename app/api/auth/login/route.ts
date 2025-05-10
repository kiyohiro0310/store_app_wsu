import { dataResponse } from "@/functions/res/data_response";
import { errorResponse } from "@/functions/res/error_response";
import { PrismaClient } from "@prisma/client";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    errorResponse(401, "User not found");
  }

  return dataResponse(200, user);
}
