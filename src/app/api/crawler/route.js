import { NextResponse } from "next/server";
const cheerio = require("cheerio");
import puppeteer from "puppeteer";
/*const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());*/

export const POST = async (req) => {
  const data = await req.json();

  scraper(data);

  return NextResponse.json({ Got: true });
};

//SCRAPING SCRIPTS
const scrapeDetails = () => {
  //e-mail, esindusisikud, kaive, tootajate arv, telo number, aadress
};

const scraper = async (dealers) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });

  let i = 1;
  while (i <= Object.keys(dealers).length) {
    console.log(`Processing item i${i}`);

    await page.goto("https://ariregister.rik.ee/est");

    await page.type("#company_search", dealers[`i${i}`].officialName);
    await page.click(".btn-primary");
    await page.waitForTimeout(400);

    //trying to get to its url if possible
    try {
      //getting the url
      const rikUrlCode = await page.evaluate(() => {
        return document.location.pathname.slice(-7);
      });

      const nameFormattor = (name) => {
        const nameArray = name.split(" ");
        let formattedName = nameArray[0];

        let i = 1;
        while (i < nameArray.length) {
          formattedName += `-${nameArray[i]}`;
          i++;
        }

        return formattedName;
      };

      const formattedName = nameFormattor(dealers[`i${i}`].officialName);
      const companysUrl = `https://ariregister.rik.ee/est/company/${
        dealers[`i${i}`].registerCode
      }/${formattedName}?search_id=${rikUrlCode}&pos=1`;
      dealers[`i${i}`].rikUrl = companysUrl;

      await page.goto(companysUrl);
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log("This one has a sketchy name");
      continue;
    }

    //proovida taieliku URL-ga puppeteeri uuesti toole saada
    /*const response = await fetch(
      `URL registrikoodi ja puppeeterilt saadud url koodi pohjal`
    );
    const htmlString = await response.text();
    const $ = cheerio.load(htmlString);*/

    i++;
  }
};

/*
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
    let linkToDealersPage;
    /*try {
      linkToDealersPage = await page.$eval(
        //".ar__center > div > div:nth-child(1) a",
        ".ar__center__bg .ar__center > div > div > div:nth-child(2) > table a",
        (a) => {
          return a.href;
        }
      );
      console.log("no error");
    } catch (e) {*/
/*linkToDealersPage = await page.$eval(".card-body > a", (a) => {
      return a.href;
    });
    linkToDealersPage = await page.$eval(".ar__center > div > div", (div) => {
      const linkElement = div.querySelector(".card-body > a");
      return linkElement.href;
    });

    console.log(linkToDealersPage);
    //}

    await page.goto(linkToDealersPage);

    break;
    i++;
  }
};

//getting the data of one dealer*/
