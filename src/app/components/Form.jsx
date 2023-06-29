"use client";
import { useState, useEffect, useCallback } from "react";

const Form = () => {
  const [businessName, setBusinessName] = useState("");
  const [isCorrectBusinessName, setIsCorrectBusinessName] = useState(false);
  const [csvFile, setCsvFile] = useState({});
  const [isCorrectCsvFile, setIsCorrectCsvFile] = useState(false);
  const [errorMessage, setErrorMessage] = useState("The form might be faulty.");
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
  const [toDisplayButton, setToDisplayButton] = useState(true);

  const handleDisplayErrorMessage = useCallback(
    (errorParams) => {
      setToDisplayButton(false);
      if (errorParams.fromWhere === "onNameChange") {
        const isCorrectCompanyName =
          businessName.length > 3 &&
          (businessName.includes("AS") || businessName.includes("OÜ"));
        if (!isCorrectCompanyName) {
          setErrorMessage(errorParams.message);
          setDisplayErrorMessage(errorParams.toDisplay);
        }
      }

      if (errorParams.fromWhere === "onFileChange") {
        setErrorMessage(errorParams.message);
        setDisplayErrorMessage(errorParams.toDisplay);
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
    setIsCorrectCsvFile(isCorrectFileType);
    setDisplayErrorMessage(!(isCorrectCsvFile && isCorrectBusinessName));
    if (isCorrectFileType) {
      setCsvFile(e.target.files[0]);
      if (!isCorrectBusinessName) {
        handleDisplayErrorMessage({
          toDisplay: true,
          message: `${businessName} isn't a correct business name. Make sure the name of the company is written correctly and contains the type of the business "OÜ" or "AS".`,
          fromWhere: "onNameChange",
        });
        return;
      }
      setDisplayErrorMessage(false);
      setToDisplayButton(true);
      return;
    }

    handleDisplayErrorMessage({
      toDisplay: true,
      message: "Make sure the file Your trying to insert is a .csv file.",
      fromWhere: "onFileChange",
    });
  };

  useEffect(() => {
    const isCorrectCompanyName =
      businessName.length > 3 &&
      (businessName.includes("AS") || businessName.includes("OÜ"));
    setIsCorrectBusinessName(isCorrectCompanyName);
    if (isCorrectCompanyName) {
      if (!isCorrectCsvFile && csvFile.type) {
        handleDisplayErrorMessage({
          toDisplay: true,
          message: "Make sure the file Your trying to insert is a .csv file.",
          fromWhere: "onFileChange",
        });
        return;
      }
      setDisplayErrorMessage(false);
      if (isCorrectCsvFile) {
        setToDisplayButton(true);
        return;
      }
      return;
    }

    if (businessName.length > 0) {
      setToDisplayButton(false);
      const waitingForUser = setTimeout(() => {
        handleDisplayErrorMessage({
          toDisplay: true,
          message: `${businessName} isn't a correct business name. Make sure the name of the company is written correctly and contains the type of the business "OÜ" or "AS".`,
          fromWhere: "onNameChange",
        });
      }, 1500);
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
      {toDisplayButton && (
        <button className="bg-custom_purple border-solid border-2 border-[#001220] text-black sm:w-3/5 mx-auto rounded-md mt-4 p-1 font-medium text-xl">
          Run checks
        </button>
      )}
    </form>
  );
};

export default Form;
