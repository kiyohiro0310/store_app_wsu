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

// GET all activities (orders and products)
export async function GET() {
  // Check admin authorization
  if (!(await isAdmin())) {
    return errorResponse(403, "Not authorized. Admin access required.");
  }

  try {
    // Get recent orders
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
      },
    });

    // Get recent products
    const products = await prisma.product.findMany({
      include: {
        owner: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        releaseDate: "desc"
      },
      take: 10
    });

    // Format orders as activities
    const orderActivities = orders.map(order => ({
      id: order.id,
      type: 'order',
      action: order.status.toLowerCase(),
      userName: order.user.name,
      userEmail: order.user.email,
      details: {
        total: order.total,
        items: order.items.map(item => item.product.name).join(', '),
        status: order.status
      },
      createdAt: order.createdAt
    }));

    // Format products as activities
    const productActivities = products.map(product => ({
      id: product.id,
      type: 'product',
      action: 'created',
      userName: product.owner.name,
      userEmail: product.owner.email,
      details: {
        name: product.name,
        price: product.price,
        category: product.category
      },
      createdAt: product.releaseDate
    }));

    // Combine and sort all activities by date
    const allActivities = [...orderActivities, ...productActivities]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10); // Get only the 10 most recent activities

    return dataResponse(200, allActivities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return errorResponse(500, "Failed to fetch activities");
  }
} 