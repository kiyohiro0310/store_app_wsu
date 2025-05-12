import { OrderItem } from "@/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function addOrderItemToDB(orderItem: OrderItem, userId: string, productId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if(!user) throw new Error("No user found");

    const currentOrder = await prisma.order.findFirst({
        where: {
            status: "PENDING",
            userId: user.id
        }
    });
    
    let order;

    if(currentOrder ) {
        order = await prisma.order.update({
            where: {
                id: currentOrder.id
            },
            data: {
                total: currentOrder.total + orderItem.pricePurchase
            }
        });
    }
    else {
        order = await prisma.order.create({
            data: {
                status: "PENDING",
                total: orderItem.pricePurchase,
                userId: user.id
            }
        });
    }

    const result = await prisma.orderItem.create({
        data: {
            orderId: order.id,
            priceAtPurchase: orderItem.pricePurchase,
            productId,
            quantity: orderItem.quantity
        }
    });

    return result;
}

export async function getPendingCartItems(userId: string) {
    // TODO 1: Get total price of PENDING
    const order = await prisma.order.findFirst({
        where: {
            userId,
            status: "PENDING"
        }
    });

    if(!order || order == null) throw new Error("No order found.");

    // TODO 2: Get orderItem by order id
    const orderItems = await prisma.orderItem.findMany({
        where: {
            orderId: order?.id
        },
        include: {
            product: {
                select: {
                    name: true,
                    imageUrl: true
                }
            }
        }
    });

    const itemsWithProductName = orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        productName: item.product?.name, // Include the product name
        productImage: item.product?.imageUrl // Include the product image (optional)
    }));


    return {
        price: order.total,
        items: itemsWithProductName
    }
}