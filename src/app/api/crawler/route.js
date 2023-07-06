import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const POST = async (req) => {
  const data = await req.json();

  console.log("Called crawler");

  const improvedData = await scraper(data.csvFileData);

  return NextResponse.json(improvedData);
};

//SCRAPING SCRIPTS
const scrapeDetails = async ({ page, dealer }) => {
  //trying to get the contact details
  try {
    const contactDetails = await page.evaluate(() => {
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
    dealer.contactDetails = contactDetails;
  } catch (err) {
    const contactDetails = {
      address: err.message,
      email: err.message,
      phoneNumber: err.message,
    };
    dealer.contactDetails = contactDetails;
  }

  //trying to get the amount of employees and revenue
  try {
    const businessDetails = await page.evaluate(() => {
      const section = Array.from(
        document.querySelectorAll('[class="h2"]')
      ).filter((tag) => tag.innerText === "Maksualane info ")[0]
        .nextElementSibling.children[0].children[1];

      const taxedRevenue = section.children[3].children[1].innerText;

      const amountOfEmployees = section.children[4].children[1].innerText;

      return { taxedRevenue, amountOfEmployees };
    });
    dealer.businessDetails = businessDetails;
  } catch (err) {
    const businessDetails = {
      taxedRevenue: err.message,
      amountOfEmployees: err.message,
    };
    dealer.businessDetails = businessDetails;
  }

  //trying to get the representatives
  try {
    const representatives = await page.evaluate(() => {
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
    dealer.representatives = representatives;
  } catch (err) {
    dealer.representatives = [err.message];
  }

  return dealer;
};

const scraper = async (dealers) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });

  let i = 0;
  while (i < dealers.length) {
    console.log(`Getting business data for ${i + 1}/${dealers.length}`);
    //looking if its even possible to search for data
    if (dealers[i].registerCode === "-") {
      dealers[i].representatives = [
        "Couldn't fetch data on the Estonian business registry, because You didn't include the register code in the CSV file.",
      ];
      dealers[i].businessDetails = {
        taxedRevenue:
          "Couldn't fetch data on the Estonian business registry, because You didn't include the register code in the CSV file.",
        amountOfEmployees:
          "Couldn't fetch data on the Estonian business registry, because You didn't include the register code in the CSV file.",
      };
      dealers[i].contactDetails = {
        address:
          "Couldn't fetch data on the Estonian business registry, because You didn't include the register code in the CSV file.",
        email:
          "Couldn't fetch data on the Estonian business registry, because You didn't include the register code in the CSV file.",
        phoneNumber:
          "Couldn't fetch data on the Estonian business registry, because You didn't include the register code in the CSV file.",
      };
      i++;
      continue;
    }

    //trying to get to its page if possible
    try {
      await page.goto("https://ariregister.rik.ee/est");
      await page.type("#company_search", dealers[i].officialName);
      await page.click(".btn-primary");
      await page.waitForTimeout(500);

      //getting the url
      const rikUrlCode = await page.evaluate(() => {
        return document.location.pathname.slice(-7);
      });

      const nameFormattor = (name) => {
        return name.replaceAll(" ", "-");
      };

      const formattedName = nameFormattor(dealers[i].officialName);
      const companysUrl = `https://ariregister.rik.ee/est/company/${dealers[i].registerCode}/${formattedName}?search_id=${rikUrlCode}&pos=1`;
      dealers[i].rikUrl = companysUrl;

      await page.goto(companysUrl);
      await page.waitForTimeout(2000);
    } catch (e) {
      dealers[i].rikUrl = "Failed to generate.";
    }

    //reducing the amount of bandwidth used up by the function by making less requests if possible
    if (dealers[i].rikUrl !== "Failed to generate.") {
      //scraping as much details as possible
      const dealerWithNewData = await scrapeDetails({
        page,
        dealer: dealers[i],
      });
      dealers[i] = dealerWithNewData;
    } else {
      dealers[i].representatives = [
        "Failed access the companys personal page on RIK, because we failed to generate an acceptable RIK url.",
      ];
      dealers[i].businessDetails = {
        taxedRevenue:
          "Failed access the companys personal page on RIK, because we failed to generate an acceptable RIK url.",
        amountOfEmployees:
          "Failed access the companys personal page on RIK, because we failed to generate an acceptable RIK url.",
      };
      dealers[i].contactDetails = {
        address:
          "Failed access the companys personal page on RIK, because we failed to generate an acceptable RIK url.",
        email:
          "Failed access the companys personal page on RIK, because we failed to generate an acceptable RIK url.",
        phoneNumber:
          "Failed access the companys personal page on RIK, because we failed to generate an acceptable RIK url.",
      };
    }
    i++;
  }
  browser.close();
  return dealers;
};
