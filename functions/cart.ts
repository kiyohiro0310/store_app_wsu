import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteCartItem(orderItemId: string, userId: string) {
  try {
    // Get the order item with its product
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        order: true,
        product: true
      }
    });

    if (!orderItem) {
      throw new Error("Order item not found");
    }

    // Verify the order belongs to the user
    if (orderItem.order.userId !== userId) {
      throw new Error("Not authorized to delete this item");
    }

    // Get the current product
    const product = await prisma.product.findUnique({
      where: { id: orderItem.productId }
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Start a transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
      // Delete the order item
      await tx.orderItem.delete({
        where: { id: orderItemId }
      });

      // Update the order total
      const updatedOrder = await tx.order.update({
        where: { id: orderItem.orderId },
        data: {
          total: orderItem.order.total - (orderItem.priceAtPurchase * orderItem.quantity)
        }
      });

      // Restore the product quantity
      await tx.product.update({
        where: { id: orderItem.productId },
        data: {
          quantity: product.quantity + orderItem.quantity,
          inStock: true // Set inStock to true since we're adding back items
        }
      });

      // If the order has no more items, delete it
      const remainingItems = await tx.orderItem.count({
        where: { orderId: orderItem.orderId }
      });

      if (remainingItems === 0) {
        await tx.order.delete({
          where: { id: orderItem.orderId }
        });
      }

      return updatedOrder;
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    throw new Error("Failed to delete cart item");
  }
}