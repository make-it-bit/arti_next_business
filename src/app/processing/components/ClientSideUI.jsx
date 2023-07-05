"use client";
import { useEffect, useState } from "react";

const ClientSideUI = () => {
  const [objectOfCompanys, setobjectOfCompanys] = useState({});
  const [gotResponse, setGotResponse] = useState(false);
  const [errorText, setErrorText] = useState(
    "An error may have occured because there are no results to show."
  );

  const getData = async () => {
    const data = JSON.parse(localStorage.getItem("carDealers"));
    let ip;
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const ipData = await response.json();
      ip = ipData;
      data.user = ip;
    } catch (error) {
      alert(
        "Failed to start fetching scripts, make sure Your browser is allright"
      );
      setGotResponse(true);
      return;
    }

    const getCrawlerData = new Promise(async (resolve) => {
      const responseWithStats = await fetch(
        "http://localhost:3000/api/crawler",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const dataWithStats = await responseWithStats.json();
      resolve(dataWithStats);
    });

    const getLightHouseData = new Promise(async (resolve) => {
      const responseWithStats = await fetch(
        "http://localhost:3000/api/lighthouse",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const dataWithStats = await responseWithStats.json();
      resolve(dataWithStats);
    });

    try {
      const allDataWithStats = await Promise.all([
        getCrawlerData,
        getLightHouseData,
      ]);

      console.log(allDataWithStats);
      if (allDataWithStats[0].error || allDataWithStats[1].error) {
        setErrorText(allDataWithStats[0].error || allDataWithStats[1].error);
        setGotResponse(true);
        return;
      }

      const finalObject = allDataWithStats[0];
      let i = 1;

      while (i <= Object.keys(finalObject).length - 1) {
        finalObject[`i${i}`].lightHouseData =
          allDataWithStats[1][`i${i}`].lighthouseResults;

        i++;
      }

      setobjectOfCompanys(allDataWithStats[0]);
      setGotResponse(true);
    } catch (e) {
      setGotResponse(true);
    }
  };

  useEffect(() => {
    //wait for getData to finish and then start generating the csv file with the new values
    getData();
  }, []);

  useEffect(() => {
    console.log("Companys:", objectOfCompanys);
  }, [objectOfCompanys]);

  //base showing lighthouse test off this code snippet
  /*fetch(url)
    .then(response => response.json())
    .then(json => {
      // See https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed#response
      // to learn more about each of the properties in the response object.
      showInitialContent(json.id);
      const cruxMetrics = {
        "First Contentful Paint": json.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category,
        "First Input Delay": json.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category
      };
      showCruxContent(cruxMetrics);
      const lighthouse = json.lighthouseResult;
      const lighthouseMetrics = {
        'First Contentful Paint': lighthouse.audits['first-contentful-paint'].displayValue,
        'Speed Index': lighthouse.audits['speed-index'].displayValue,
        'Time To Interactive': lighthouse.audits['interactive'].displayValue,
        'First Meaningful Paint': lighthouse.audits['first-meaningful-paint'].displayValue,
        'First CPU Idle': lighthouse.audits['first-cpu-idle'].displayValue,
        'Estimated Input Latency': lighthouse.audits['estimated-input-latency'].displayValue
      };
      showLighthouseContent(lighthouseMetrics);
    });*/

  const Results = () => {};

  const ShowResults = () => {
    return (
      <div>
        {objectOfCompanys.i1 ? <p>Got results </p> : <p>{errorText}</p>}
      </div>
    );
  };
  const ContentSection = () => {
    return (
      <section>
        {gotResponse ? (
          <ShowResults />
        ) : (
          <div>
            <p>
              We&apos;re processing the data, please don&apos;t refresh the
              page.
            </p>
          </div>
        )}
      </section>
    );
  };

  return (
    <main className="bg-custom_purple p-4 m-8 rounded-md">
      <ContentSection />
    </main>
  );
};

export default ClientSideUI;
