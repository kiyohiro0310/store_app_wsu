import { errorResponse } from "@/functions/res/error_response";
import { dataResponse } from "@/functions/res/data_response";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Check if user is admin
async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return false;
  }

  // Check if user has admin role
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return user?.userType === "ADMIN";
}

// GET single order with details
export async function GET(req: Request, { params }: { params: { id: string } }) {
  // Check admin authorization
  if (!(await isAdmin())) {
    return errorResponse(403, "Not authorized. Admin access required.");
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return errorResponse(404, "Order not found");
    }

    // Format the response
    const formattedOrder = {
      id: order.id,
      userId: order.userId,
      userName: order.user.name,
      userEmail: order.user.email,
      total: order.total,
      createdAt: order.createdAt,
      status: order.status,
      items: order.items.map(item => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        productName: item.product.name,
        productImage: item.product.imageUrl
      }))
    };

    return dataResponse(200, formattedOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    return errorResponse(500, "Failed to fetch order");
  }
}

// PATCH to update order status
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  // Check admin authorization
  if (!(await isAdmin())) {
    return errorResponse(403, "Not authorized. Admin access required.");
  }

  try {
    const { status } = await req.json();
    
    // Validate status
    const validStatuses = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return errorResponse(400, "Invalid status. Must be one of: PENDING, PAID, SHIPPED, CANCELLED");
    }
    
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id }
    });

    if (!existingOrder) {
      return errorResponse(404, "Order not found");
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status }
    });

    return dataResponse(200, updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return errorResponse(500, "Failed to update order");
  }
} 