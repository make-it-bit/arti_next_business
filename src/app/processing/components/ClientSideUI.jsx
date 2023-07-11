"use client";
import { useEffect, useState } from "react";

import Form from "./Form";
import ResultsDisplayer from "./ResultsDisplayer";

import readCSVFile from "../../lib/readDataFromFile";

const ClientSideUI = () => {
  const [companys, setCompanys] = useState([]);
  const [gotResponse, setGotResponse] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "An error has occured, please try again later."
  );
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const [dataRequested, setDataRequested] = useState(false);
  const [dataFromCSVFile, setDataFromCSVFile] = useState([]);

  const getDataFromCSVFile = (csvFile) => {
    const parsedCSVFile = readCSVFile(csvFile);
    setDataFromCSVFile(parsedCSVFile);
  };

  const getData = async () => {
    setDataRequested(true);

    const data = { csvFileData: dataFromCSVFile };
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      if (!response.ok)
        throw new Error(
          "Failed to fetch IP, please make sure Your browser is working correctly."
        );
      const { ip } = await response.json();
      data.userIp = ip;

      const getCrawlerData = new Promise(async (resolve) => {
        const response = await fetch("http://localhost:3000/api/crawler", {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(response.statusText);
        const dataWithStats = await response.json();
        resolve(dataWithStats);
      });
      const getLightHouseData = new Promise(async (resolve) => {
        const response = await fetch("http://localhost:3000/api/lighthouse", {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(response.statusText);
        const dataWithStats = await response.json();
        resolve(dataWithStats);
      });

      const allDataWithStats = await Promise.all([
        getCrawlerData,
        getLightHouseData,
      ]);

      if (
        allDataWithStats[0].length !== allDataWithStats[1].length ||
        allDataWithStats[0].length === 0
      )
        throw new Error("We failed to generate data");

      const returnArray = [];
      let i = 0;
      while (i < allDataWithStats[0].length) {
        const { lighthouseResults } = allDataWithStats[1][i];
        allDataWithStats[0][i].lightHouseData = lighthouseResults;
        returnArray.push(allDataWithStats[0][i]);
        i++;
      }

      setCompanys(returnArray);
      setGotResponse(true);
    } catch (err) {
      setGotResponse(true);
      setErrorOccured(true);
      setErrorMessage(err.message);
      return;
    }
  };

  useEffect(() => {
    console.log("Companys:", companys);
  }, [companys]);

  const ContentSection = () => {
    return (
      <div>
        {gotResponse ? (
          <ResultsDisplayer />
        ) : (
          <div>
            <h2 className="text-3xl text-white font-semibold">
              Getting to work
            </h2>
            <p className="text-xl text-slate-200 my-4">
              We&apos;re processing the data, please don&apos;t refresh the
              page.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-custom_purple p-4 m-8 rounded-md section-background">
      <div
        className={`${errorOccured && "hidden"} ${isFormSubmitted && "hidden"}`}
      >
        <Form
          setIsFormSubmitted={setIsFormSubmitted}
          getDataFromCSVFile={getDataFromCSVFile}
        />
      </div>
      <div
        className={`${!isFormSubmitted && "hidden"} ${
          errorOccured && "hidden"
        }`}
      >
        <div className={`${!dataRequested && "hidden"}`}>
          <ContentSection />
        </div>
        <div className={`${dataRequested && "hidden"}`}>
          <h2 className="text-3xl font-semibold text-white ">
            We&apos;ve got Your file!
          </h2>
          <button
            className={`bg-custom_purple border-solid border-2 border-custom_black text-black sm:w-3/5 mx-auto rounded-md mt-4 p-1 font-medium text-2xl ${
              dataRequested && "hidden"
            }`}
            onClick={getData}
          >
            Get data
          </button>
        </div>
      </div>
      <div
        className={`backdrop-blur-sm bg-red-500/40 w-fit mx-auto p-4 rounded-md ${
          errorOccured ? "block" : "hidden"
        }`}
      >
        <h2 className="text-2xl font-semibold">An error occured</h2>
        <p className="text-xl my-4">{errorMessage}</p>
      </div>
    </div>
  );
};

export default ClientSideUI;
