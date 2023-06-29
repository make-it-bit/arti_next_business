"use client";
import { useState, useEffect, useCallback } from "react";

const Form = () => {
  const [businessName, setBusinessName] = useState("");
  const [csvFile, setCsvFile] = useState({});
  const [errorMessage, setErrorMessage] = useState("The form might be faulty.");
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

  const handleDisplayErrorMessage = useCallback(
    (toDisplay, errormessage) => {
      console.log("toDisplay, errormessage: ", toDisplay, errormessage);

      const isCorrectCompanyName =
        businessName.length > 3 &&
        (businessName.includes("AS") || businessName.includes("OÜ"));

      if (!isCorrectCompanyName) {
        setErrorMessage(errormessage);
        setDisplayErrorMessage(toDisplay);
      } else {
        setErrorMessage("The form might be faulty.");
        setDisplayErrorMessage(false);
      }
    },
    [businessName]
  );

  const onFileChange = (e) => {
    const isCorrectFileType =
      e.target.files[0].type === "text/csv" ||
      e.target.files[0].type === "application/vnd.ms-excel" ||
      e.target.files[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (isCorrectFileType) {
      setCsvFile(e.target.files[0]);
      console.log("Got correct file");
    }

    handleDisplayErrorMessage(
      true,
      "Make sure the file Your trying to insert is a .csv file."
    );
  };

  useEffect(() => {
    const isCorrectCompanyName =
      businessName.length > 3 &&
      (businessName.includes("AS") || businessName.includes("OÜ"));
    if (isCorrectCompanyName) {
      handleDisplayErrorMessage(false, "The form might be faulty.");
    }

    if (businessName.length > 0) {
      const waitingForUser = setTimeout(() => {
        handleDisplayErrorMessage(
          true,
          `${businessName} isn't a correct business name. Make sure the name of the company is written correctly and contains the type of the business "OÜ" or "AS".`
        );
      }, 2000);
      return () => clearTimeout(waitingForUser);
    }
  }, [businessName, handleDisplayErrorMessage]);

  return (
    <form className="flex flex-col w-3/5 mx-auto ">
      <div
        className="backdrop-blur-sm bg-white/20 rounded-md text-xl font-medium text-white p-2 mb-2"
        style={{ display: displayErrorMessage ? "block" : "none" }}
      >
        <p>{errorMessage}</p>
      </div>
      <label
        className="text-left text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-500"
        htmlFor="business-name"
      >
        Official name of the Business
      </label>
      <input
        type="name"
        placeholder='For example "AABITS OÜ"'
        id="business-name"
        name="businessName"
        required
        className="rounded-md py-1 px-2 mb-2 text-black font-medium focus:outline-none text-lg"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
      />
      <label
        htmlFor="csv_file"
        className="bg-[#001220] border-solid border-2 border-custom_purple text-black rounded-md mt-2 p-1 font-medium text-xl"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-500">
          Submit the correctly formatted CSV file here
        </span>
        <input
          type="file"
          required
          className="hidden"
          id="csv_file"
          name="file"
          onChange={(e) => onFileChange(e)}
          accept="application/vnd.openxmlformats"
        />
      </label>
      <button className="bg-custom_purple border-solid border-2 border-[#001220] text-black sm:w-3/5 mx-auto rounded-md mt-4 p-1 font-medium text-xl">
        Run checks
      </button>
    </form>
  );
};

export default Form;
