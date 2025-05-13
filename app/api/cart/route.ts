import { dataResponse } from "@/functions/res/data_response";
import { errorResponse } from "@/functions/res/error_response";
import { getServerSession } from "next-auth";
import { getUserByEmail } from "@/functions/user";
import { addOrderItemToDB, getPendingCartItems } from "@/functions/order";
import { OrderItem } from "@/types";
import { getProductById } from "@/functions/products";
import { authOptions } from "../auth/[...nextauth]/options";
import { emailRegex } from "@/functions/regEx";
import { deleteCartItem } from "@/functions/cart";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return errorResponse(403, "You are not authorised to this page.");

  try {
    const data = session;
    if (!data || !data.user || !data.user.email) {
      return errorResponse(403, "You are not authroised to this page.");
  }
    const user = await getUserByEmail(data.user.email)

    if(!user) return errorResponse(404, "No user found.");

    const cartItems = await getPendingCartItems(user.id);

    return dataResponse(200, cartItems);
  } catch (error) {
    return errorResponse(500, "Internal server error");
  }
}

export async function POST(req: Request) {
  const { userEmail, productId } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return errorResponse(403, "You are not authorised to this page.");
  }

  try {
    console.log(userEmail)
    // Validate userEmail
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!userEmail || !emailRegex.test(userEmail)) {
      console.log("Invalid email");
      return errorResponse(400, "Invalid email address.");
    }

    // Validate productId
    if (
      !productId ||
      typeof productId !== "string" ||
      productId.trim() === ""
    ) {
      return errorResponse(400, "Invalid product ID.");
    }

    // TODO 1: Find user by user email
    const user = await getUserByEmail(userEmail);
    if (!user || user == null) return errorResponse(404, "No user found.");

    // TODO 2: Find product
    const product = await getProductById(productId);
    if (!product || product == null)
      return errorResponse(404, "No product found");

    // TODO 2: Add order item using userId, price, prouctId and quantity
    const orderItem: OrderItem = {
      orderId: "",
      pricePurchase: product.price,
      productId: product.id,
      quantity: 1,
    };

    const result = await addOrderItemToDB(orderItem, user.id, productId);
    if (!result) return errorResponse(400, "Error occured");

    return dataResponse(200, result);
  } catch (error) {
    return errorResponse(500, "Internal server error");
  }
}

export async function DELETE(req: Request) {
  const { orderItemId } = await req.json();

  console.log(orderItemId)

  const session = await getServerSession(authOptions);

  if (!session) {
    return errorResponse(403, "You are not authorised to this page.");
  }

  try {
    if (!session.user) return errorResponse(403, "You are not authorised to this page.");
    const userEmail = session.user.email;
    // Validate userEmail
    if (!userEmail || !emailRegex.test(userEmail)) {
      return errorResponse(400, "Invalid email address.");
    }

    // Validate productId
    if (!orderItemId || typeof orderItemId !== "string" || orderItemId.trim() === "") {
      return errorResponse(400, "Invalid product ID.");
    }

    // Find user by email
    const user = await getUserByEmail(userEmail);
    if (!user) return errorResponse(404, "No user found.");

    // Delete the order item
    const result = await deleteCartItem(orderItemId, user.id);


    return dataResponse(200, { message: "Item removed from cart successfully." });
  } catch (error) {
    console.error("Error in DELETE /api/cart:", error);
    return errorResponse(500, "Internal server error");
  }
}