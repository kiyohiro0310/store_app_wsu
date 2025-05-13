import { getOrderById, updateOrder } from "@/functions/order";
import { dataResponse } from "@/functions/res/data_response";
import { errorResponse } from "@/functions/res/error_response";
import { getUserByEmail } from "@/functions/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session)
      return errorResponse(403, "You are not authorised to this page.");
  
    try {
      const data = session;
      if (!data || !data.user || !data.user.email) {
        return errorResponse(403, "You are not authroised to this page.");
    }
      
    const { orderId } = await req.json();

    const result = await updateOrder(orderId);

    if(!result) return errorResponse(404, "Order not found.");
  
      return dataResponse(200, result);
    } catch (error) {
      return errorResponse(500, "Internal server error");
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session)
      return errorResponse(403, "You are not authorised to this page.");
  
    try {
      const data = session;
      if (!data || !data.user || !data.user.email) {
        return errorResponse(403, "You are not authroised to this page.");
    }
      
    const orderId = new URL(req.url).searchParams.get("orderId");

    if (!orderId) return errorResponse(400, "Order ID is required.");

    const result = await getOrderById(orderId);

    if(!result) return errorResponse(404, "Order not found.");
  
      return dataResponse(200, result);
    } catch (error) {
      return errorResponse(500, "Internal server error");
    }
}