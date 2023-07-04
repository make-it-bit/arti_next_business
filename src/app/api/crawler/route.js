import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const POST = async (req) => {
  const data = await req.json();

  const improvedData = await scraper(data);

  return NextResponse.json(improvedData);
};

//SCRAPING SCRIPTS
const scrapeDetails = async (params) => {
  //trying to get the contact details
  try {
    const contactDetails = await params.page.evaluate(() => {
      const section = Array.from(
        document.querySelectorAll('[class="h2 mb-1"]')
      ).filter((tag) => tag.innerText === "Kontaktid")[0].parentElement;

      const address = section.children[1].children[1].innerText.replace(
        " Ava kaart",
        ""
      );
      const email = section.children[2].children[1].innerText;
      const phoneNumber = section.children[4].children[1].innerText;

      return { address, email, phoneNumber };
    });
    params.dealer.contactDetails = contactDetails;
  } catch (e) {
    params.dealer.contactDetails =
      "Failed to fetch on the Estonian business registry.";
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
    params.dealer.businessDetails =
      "Failed to fetch on the Estonian business registry.";
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
        const representative = section.children[i].children[0].innerText;
        representatives.push(
          representative.replaceAll(`\n`, "").replaceAll("  ", "")
        );
        i++;
      }
      return representatives;
    });
    params.dealer.representatives = representatives;
  } catch (e) {
    params.dealer.representatives =
      "Failed to fetch on the Estonian business registry.";
  }

  return params.dealer;
};

const scraper = async (dealers) => {
  if (typeof puppeteer === "undefined") return dealers;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });

  let i = 0;
  while (i < Object.keys(dealers).length) {
    i++;
    console.log(`Getting business data for i${i}`);
    //looking if its even possible to search for data
    if (dealers[`i${i}`].registerCode === "-") {
      dealers[`i${i}`].representatives =
        "Couldn't fetch data on the Estonian business registry.";
      dealers[`i${i}`].businessDetails =
        "Couldn't fetch data on the Estonian business registry.";
      dealers[`i${i}`].contactDetails =
        "Couldn't fetch data on the Estonian business registry.";
      continue;
    }

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
        return name.replaceAll(" ", "-");
      };

      const formattedName = nameFormattor(dealers[`i${i}`].officialName);
      const companysUrl = `https://ariregister.rik.ee/est/company/${
        dealers[`i${i}`].registerCode
      }/${formattedName}?search_id=${rikUrlCode}&pos=1`;
      dealers[`i${i}`].rikUrl = companysUrl;

      await page.goto(companysUrl);
      await page.waitForTimeout(2000);
    } catch (e) {
      dealers[`i${i}`].rikUrl = "Failed to generate.";
    }

    //reducing the amount of bandwidth used up by the function by making less requests if possible
    if (dealers[`i${i}`].rikUrl !== "Failed to generate.") {
      //scraping as much details as possible
      const dealerWithNewData = await scrapeDetails({
        page,
        dealer: dealers[`i${i}`],
      });
      dealers[`i${i}`] = dealerWithNewData;
    } else {
      dealers[`i${i}`].representatives =
        "Failed to fetch on the Estonian business registry.";
      dealers[`i${i}`].businessDetails =
        "Failed to fetch on the Estonian business registry.";
      dealers[`i${i}`].contactDetails =
        "Failed to fetch on the Estonian business registry.";
    }
  }
  browser.close();
  return dealers;
};
