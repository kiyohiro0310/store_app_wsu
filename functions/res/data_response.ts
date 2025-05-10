
export async function dataResponse(
  statusCode: number,
  data: any,
) {
  return new Response(
    JSON.stringify(data),
    {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}