import { errorResponse } from "@/functions/res/error_response";
import { dataResponse } from "@/functions/res/data_response";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Check if user is admin
async function isAdmin(req: Request) {
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

// GET all products
export async function GET(req: Request) {
  // Check admin authorization
  if (!(await isAdmin(req))) {
    return errorResponse(403, "Not authorized. Admin access required.");
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" }
    });
    return dataResponse(200, products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return errorResponse(500, "Failed to fetch products");
  }
}

// POST new product
export async function POST(req: Request) {
  // Check admin authorization
  if (!(await isAdmin(req))) {
    return errorResponse(403, "Not authorized. Admin access required.");
  }

  try {
    const productData = await req.json();
    
    // Get admin user for product ownership
    const session = await getServerSession(authOptions);
    const admin = await prisma.user.findUnique({
      where: { email: session?.user?.email! },
    });

    if (!admin) {
      return errorResponse(404, "Admin user not found");
    }

    // Create the product
    const newProduct = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        currency: productData.currency,
        category: productData.category,
        imageUrl: productData.imageUrl,
        inStock: productData.inStock,
        tags: productData.tags,
        rating: productData.rating,
        releaseDate: new Date(productData.releaseDate),
        ownerId: admin.id
      }
    });

    return dataResponse(201, newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return errorResponse(500, "Failed to create product");
  }
} 