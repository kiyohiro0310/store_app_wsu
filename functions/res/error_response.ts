

export function errorResponse(statusCode: number, message: string) {
  return new Response(
    JSON.stringify({
      error: message,
    }),
    {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}