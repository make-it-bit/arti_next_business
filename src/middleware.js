import { NextResponse } from "next/server";

//js engine creates objects already as hash table
let objectWithIps = {};
//cleans the object after some time
setInterval(() => (objectWithIps = {}), 10 * 60 * 1000);

export const middleware = async (request) => {
  const requestOrigin = request.headers.get("origin");

  const data = await request.json();
  objectWithIps[data.user.ip] =
    typeof objectWithIps[data.user.ip] === "undefined"
      ? (objectWithIps[data.user.ip] = 1)
      : (objectWithIps[data.user.ip] += 1);
  console.log(objectWithIps);

  if (objectWithIps[data.user.ip] > 4) {
    console.log("Triggered limiter");
    return NextResponse.json(
      { error: "You made too many requests in a 10 minute period" },
      {
        status: 400,
        statusText: "API limiter triggered",
      }
    );
  }

  if (requestOrigin === process.env.CURRENT_URL) {
    return new NextResponse(null, {
      status: 400,
      statusText: "Don't call us again.",
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  return NextResponse.next();
};

export const config = {
  matcher: [/*"/api/:path*",*/ "/api/crawler/:path*", "/api/lighthouse/:path*"],
};
