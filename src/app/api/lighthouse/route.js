import { NextResponse } from "next/server";

//https://developers.google.com/speed/docs/insights/v5/get-started
//API KEY in .env file
export const POST = async (req) => {
  const data = await req.json();
  console.log(data);
  return NextResponse.json({ Got: true });
};
