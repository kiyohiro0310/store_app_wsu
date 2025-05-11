import { dataResponse } from "@/functions/res/data_response";

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);
    const id = searchParams.get("id");
    
    return dataResponse(200, id);
}