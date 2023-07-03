import { NextResponse } from "next/server";

export const middleware = (request) => {
  const requestOrigin = request.headers.get("origin");
  console.log("requestOrigin: ", requestOrigin);

  if (requestOrigin === process.env.CURRENT_URL) {
    return new NextResponse(null, {
      status: 400,
      statusText: "Don't call us again.",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  console.log("middleware called");

  return NextResponse.next();
};

export const config = {
  matcher: "/api/:path",
};
