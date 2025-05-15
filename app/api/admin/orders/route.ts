import { errorResponse } from "@/functions/res/error_response";
import { dataResponse } from "@/functions/res/data_response";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
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

// GET all orders with user details and items
export async function GET() {
  // Check admin authorization
  if (!(await isAdmin())) {
    return errorResponse(403, "Not authorized. Admin access required.");
  }

  try {
    const orders = await prisma.order.findMany({
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
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Format the response
    const formattedOrders = orders.map(order => ({
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
        productName: item.product.name
      }))
    }));

    return dataResponse(200, formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return errorResponse(500, "Failed to fetch orders");
  }
} 