"use client";
import { useEffect, useState } from "react";

const ClientSideUI = () => {
  const [arrayOfCompanys, setArrayOfCompanys] = useState([]);
  const [gotResponse, setGotResponse] = useState(false);

  const getData = async () => {
    const data = localStorage.getItem("carDealers");

    const getCrawlerData = new Promise(async (resolve) => {
      console.log("Calling the crawler API with", data);
      const responseWithStats = await fetch(
        "http://localhost:3000/api/crawler",
        {
          method: "POST",
          body: data,
        }
      );
      const dataWithStats = await responseWithStats.json();
      resolve(dataWithStats);
    });

    const getLightHouseData = new Promise(async (resolve) => {
      console.log("Calling the lighthouse API with the same data");

      const responseWithStats = await fetch(
        "http://localhost:3000/api/lighthouse",
        {
          method: "POST",
          body: data,
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
      setGotResponse(true);
    } catch (e) {
      console.log("failed to fetch data");
    }
  };

  useEffect(() => {
    //wait for getData to finish and then start generating the csv file with the new values
    getData();
  }, []);

  const ShowResults = () => {
    return (
      <div>
        {arrayOfCompanys.length > 0 ? (
          <p>Got results </p>
        ) : (
          <p>An error may have occured, because the results array is empty</p>
        )}
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
            <p>We&apos;re processing the data, please wait.</p>
          </div>
        )}
      </section>
    );
  };

  return (
    <main>
      <ContentSection />
    </main>
  );
};

export default ClientSideUI;
