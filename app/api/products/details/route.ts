import { getProductById } from "@/functions/products";
import { dataResponse } from "@/functions/res/data_response";
import { errorResponse } from "@/functions/res/error_response";
import { unstable_cache } from "next/cache";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return errorResponse(400, "Product ID is required");
    }

    const product = await getProductById(id);
    
    if (!product) {
      return errorResponse(404, "Product not found");
    }

    return dataResponse(200, product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    return errorResponse(500, "Internal Server Error");
  }
}
