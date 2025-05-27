import { errorResponse } from "@/functions/res/error_response";
import { getAllProducts } from "@/functions/products";
import { dataResponse } from "@/functions/res/data_response";
import { Product } from "@/types";

export async function GET() {
  try {
    const products = await getAllProducts();
    return dataResponse(200, products);
  }
  catch(error) {
    return errorResponse(500, "Internal Server Error");
  }
}
