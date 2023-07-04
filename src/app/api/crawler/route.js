import { NextResponse } from "next/server";
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
const scrapeDetails = async (params) => {
  //e-mail, esindusisikud, kaive, tootajate arv, telo number, aadress

  //trying to get the contact details
  try {
    const contactDetails = await params.page.evaluate(() => {
      const section = Array.from(
        document.querySelectorAll('[class="h2 mb-1"]')
      ).filter((tag) => tag.innerText === "Kontaktid")[0].parentElement;

      const address = section.children[1].children[1].innerText;
      const email = section.children[2].children[1].innerText;
      const phoneNumber = section.children[4].children[1].innerText;

      return { address, email, phoneNumber };
    });
    params.dealer.contactDetails = contactDetails;
  } catch (e) {
    params.dealer.contactDetails = "Failed to fetch.";
  }

  //trying to get the amount of employees and revenue
  try {
    const businessDetails = await params.page.evaluate(() => {
      const section = Array.from(
        document.querySelectorAll('[class="h2"]')
      ).filter((tag) => tag.innerText === "Maksualane info ")[0]
        .nextElementSibling.children[0].children[1];

      const taxedRevenue = section.children[3].children[1].innerText;

      const amountOfEmployees = section.children[4].children[1].innerText;

      return { taxedRevenue, amountOfEmployees };
    });
    params.dealer.businessDetails = businessDetails;
  } catch (e) {
    params.dealer.businessDetails = "Failed to fetch.";
  }

  //trying to get the representatives
  try {
    const representatives = await params.page.evaluate(() => {
      const section = Array.from(
        document.querySelectorAll('[class="col h2"]')
      ).filter((tag) => tag.innerText === "Esindusõigus ")[0].parentElement
        .parentElement.children[1].children[0].children[1];

      const representatives = [];

      let i = 0;
      while (i < section.children.length) {
        const representative = section.children[
          i
        ].children[0].innerText.replace(`\n' + `, "");
        representatives.push(representative);
        i++;
      }
      return representatives;
    });
    params.dealer.representatives = representatives;
  } catch (e) {
    params.dealer.representatives = "Failed to fetch.";
  }

  return params.dealer;
};

const scraper = async (dealers) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });

  let i = 1;
  while (i <= Object.keys(dealers).length) {
    console.log(`Processing item i${i}`);

    //trying to get to its page if possible
    try {
      await page.goto("https://ariregister.rik.ee/est");
      await page.type("#company_search", dealers[`i${i}`].officialName);
      await page.click(".btn-primary");
      await page.waitForTimeout(500);
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
      [`i${i}`].rikUrl = "Failed to generate.";
      continue;
    }

    //scraping as much details as possible
    const dealerWithNewData = await scrapeDetails({
      page,
      dealer: dealers[`i${i}`],
    });
    dealers[`i${i}`] = dealerWithNewData;

    i++;
  }
  console.log(dealers);
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
