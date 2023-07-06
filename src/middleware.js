import { NextResponse } from "next/server";

//js engine creates objects already as hash table
let objectWithIps = {};
//cleans the object after some time
setInterval(() => (objectWithIps = {}), 10 * 60 * 1000);

export const middleware = async (request) => {
  const requestOrigin = request.headers.get("origin");

  const data = await request.json();
  objectWithIps[data.userIp] =
    typeof objectWithIps[data.userIp] === "undefined"
      ? (objectWithIps[data.userIp] = 1)
      : (objectWithIps[data.userIp] += 1);
  console.log(objectWithIps);

  if (
    objectWithIps[data.userIp] > 10 ||
    typeof objectWithIps[data.userIp] === "undefined"
  ) {
    console.log("Triggered limiter");
    return new NextResponse(null, {
      status: 400,
      statusText: "API limiter triggered",
    });
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
