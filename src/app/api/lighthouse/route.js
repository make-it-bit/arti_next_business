import { NextResponse } from "next/server";

export const POST = async (req) => {
  const data = await req.json();
  const improvedData = await makeAPICalls(data);
  return NextResponse.json(improvedData);
};

//https://developers.google.com/speed/docs/insights/v5/get-started
const makeAPICalls = async (dealers) => {
  const improvedDealers = {};

  let i = 0;
  while (i < Object.keys(dealers).length) {
    i++;
    console.log(`Getting Lighouse tests for i${i}`);
    try {
      const response = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${
          dealers[`i${i}`].website
        }&key=${process.env.GOOGLE_LIGHTHOUSE_API_KEY}`
      );
      const result = await response.json();

      improvedDealers[`i${i}`] = { lighthouseResults: result };
    } catch (e) {
      improvedDealers[`i${i}`] = "Failed to generate tests";
    }
  }
  return improvedDealers;
};
