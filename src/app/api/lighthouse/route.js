import { NextResponse } from "next/server";

export const POST = async (req) => {
  const data = await req.json();

  console.log("Called lighthouse");

  const improvedData = await makeAPICalls(data.csvFileData);
  return NextResponse.json(improvedData);
};

//https://developers.google.com/speed/docs/insights/v5/get-started
const makeAPICalls = async (dealers) => {
  const improvedDealers = [];

  let i = 0;
  while (i < dealers.length) {
    console.log(`Getting Lighouse tests for ${i + 1}/${dealers.length}`);
    try {
      const response = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${dealers[i].website}&key=${process.env.GOOGLE_LIGHTHOUSE_API_KEY}`
      );
      const result = await response.json();

      improvedDealers.push({ lighthouseResults: result });
    } catch (err) {
      //improvedDealers[i] = "Failed to generate tests";
      improvedDealers[i].push({ lighthouseResults: err.message });
    }
    i++;
  }
  return improvedDealers;
};
