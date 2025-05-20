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

    // Get current order with items
    const currentOrder = await prisma.order.findFirst({
        where: {
            status: "PENDING",
            userId: user.id
        },
        include: {
            items: true
        }
    });
    
    let order;

    // Check if product already exists in cart
    if (currentOrder) {
        const existingItem = currentOrder.items.find(item => item.productId === productId);
        
        if (existingItem) {
            // Update existing item quantity
            const updatedItem = await prisma.orderItem.update({
                where: { id: existingItem.id },
                data: { 
                    quantity: existingItem.quantity + orderItem.quantity,
                    priceAtPurchase: orderItem.pricePurchase // Update price in case it changed
                }
            });

            // Update order total
            order = await prisma.order.update({
                where: { id: currentOrder.id },
                data: {
                    total: currentOrder.total + (orderItem.pricePurchase * orderItem.quantity)
                }
            });

            // Get current product
            const currentProduct = await prisma.product.findUnique({
                where: { id: productId }
            });

            if (!currentProduct) {
                throw new Error("Product not found");
            }

            // Update product quantity
            await prisma.product.update({
                where: { id: productId },
                data: {
                    inStock: currentProduct.quantity - orderItem.quantity > 0,
                    quantity: currentProduct.quantity - orderItem.quantity
                }
            });

            return updatedItem;
        }

        // Add new item to existing order
        order = await prisma.order.update({
            where: {
                id: currentOrder.id
            },
            data: {
                total: currentOrder.total + (orderItem.pricePurchase * orderItem.quantity)
            }
        });
    } else {
        // Create new order
        order = await prisma.order.create({
            data: {
                status: "PENDING",
                total: orderItem.pricePurchase * orderItem.quantity,
                userId: user.id
            }
        });
    }

    // Create new order item
    await prisma.orderItem.create({
        data: {
            orderId: order.id,
            priceAtPurchase: orderItem.pricePurchase,
            productId,
            quantity: orderItem.quantity
        }
    });

    // Get current product
    const currentProduct = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!currentProduct) {
        throw new Error("Product not found");
    }

    // Update product quantity
    await prisma.product.update({
        where: { id: productId },
        data: {
            inStock: currentProduct.quantity - orderItem.quantity > 0,
            quantity: Math.max(0, currentProduct.quantity - orderItem.quantity)
        }
    });

    return true;
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
        orderId: item.orderId,
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

export async function updateOrder(orderId: string) {
    const order = await prisma.order.update({
        where: {
            id: orderId
        },
        data: {
            status: "PAID"
        }
    });

    return order;
}

export async function getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId
        },
        include: {
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
        throw new Error("Order not found");
    }

    const itemsWithProductDetails = order.items.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        productName: item.product?.name,
        productImage: item.product?.imageUrl
    }));

    return {
        ...order,
        items: itemsWithProductDetails
    };
}