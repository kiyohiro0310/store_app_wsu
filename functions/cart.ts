import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteCartItem(orderItemId: string, userId: string) {
  try {
    // Find the order item to get its price and quantity
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { order: true }, // Include the associated order
    });

    if (!orderItem) {
      throw new Error("Order item not found");
    }

    // Ensure the order belongs to the user
    if (orderItem.order.userId !== userId) {
      throw new Error("Unauthorized action");
    }

    // Deduct the price from the order total
    const priceToDeduct = orderItem.priceAtPurchase * orderItem.quantity;

    // Delete the order item
    const deletedItem = await prisma.orderItem.delete({
      where: { id: orderItemId },
    });

    // Update the order's total price
    await prisma.order.update({
      where: { id: orderItem.orderId },
      data: {
        total: {
          decrement: priceToDeduct, // Deduct the price
        },
      },
    });

    return deletedItem;
  } catch (error) {
    console.error("Error deleting cart item:", error);
    throw new Error("Failed to delete cart item");
  }
}