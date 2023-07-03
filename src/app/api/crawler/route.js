import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
/*const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());*/

export const POST = async (req) => {
  const data = await req.json();
  mainPuppeteer(data);
  return NextResponse.json({ Got: true });
};

//PUPPETEER'S SCRIPTS
const mainPuppeteer = async (dealers) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });

  let i = 1;

  //looping over the dealers
  while (i <= Object.keys(dealers).length) {
    console.log(`Processing item i${i}`);

    await page.goto("https://ariregister.rik.ee/est");

    await page.type("#company_search", dealers[`i${i}`].officialName);
    await page.click(".btn-primary");
    await page.waitForTimeout(1000);

    //getting another link
    const button2 = await page.$eval(
      ".ar__center > div > div:nth-child(1) a",
      (a) => {
        return a.href;
      }
    );
    console.log(button2);

    break;
    i++;
  }
};

//getting the data of one dealer
