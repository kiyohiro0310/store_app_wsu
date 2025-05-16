import { errorResponse } from "@/functions/res/error_response";
import { dataResponse } from "@/functions/res/data_response";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
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

// GET single product
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin authorization
  if (!(await isAdmin(req))) {
    return errorResponse(403, "Not authorized. Admin access required.");
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: (await params).id },
    });

    if (!product) {
      return errorResponse(404, "Product not found");
    }

    return dataResponse(200, product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return errorResponse(500, "Failed to fetch product");
  }
}

// PUT/UPDATE product
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin authorization
  if (!(await isAdmin(req))) {
    return errorResponse(403, "Not authorized. Admin access required.");
  }

  try {
    const productData = await req.json();

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: (await params).id },
    });

    if (!existingProduct) {
      return errorResponse(404, "Product not found");
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: (await params).id },
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
        ...(productData.releaseDate && {
          releaseDate: new Date(productData.releaseDate),
        }),
      },
    });

    return dataResponse(200, updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return errorResponse(500, "Failed to update product");
  }
}

// DELETE product
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin authorization
  if (!(await isAdmin(req))) {
    return errorResponse(403, "Not authorized. Admin access required.");
  }

  try {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: (await params).id },
    });

    if (!existingProduct) {
      return errorResponse(404, "Product not found");
    }

    // Check if the product is part of any orders
    const usedInOrders = await prisma.orderItem.findFirst({
      where: { productId: (await params).id },
    });

    if (usedInOrders) {
      return errorResponse(
        400,
        "Cannot delete product that is part of existing orders"
      );
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: (await params).id },
    });

    return dataResponse(200, { message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return errorResponse(500, "Failed to delete product");
  }
}
