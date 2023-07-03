"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { readCSVFile } from "../lib/readDataFromFile";

const Form = () => {
  const [businessName, setBusinessName] = useState("");
  const [isCorrectBusinessName, setIsCorrectBusinessName] = useState(false);
  const [csvFile, setCsvFile] = useState({ type: false });
  const [isCorrectCsvFile, setIsCorrectCsvFile] = useState(false);
  const [errorMessage, setErrorMessage] = useState("The form might be faulty.");
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);
  const [toDisplayButton, setToDisplayButton] = useState(true);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [parsedCsv, setParsedCsv] = useState(false);
  const [pageHasntLoaded, setPageHasntLoaded] = useState(true);

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
    const isCorrectFileType = e.target.files[0].type === "text/csv";

    setIsCorrectCsvFile(isCorrectFileType);
    setDisplayErrorMessage(!(isCorrectCsvFile && isCorrectBusinessName));
    if (isCorrectFileType) {
      setCsvFile(e.target.files[0]);
      if (!isCorrectBusinessName) {
        handleDisplayErrorMessage({
          toDisplay: true,
          message: `"${businessName}" isn't a correct business name. Make sure the name of the company is written correctly and contains the type of the business "OÜ" or "AS".`,
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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!(isCorrectCsvFile && isCorrectBusinessName)) {
      alert("You provided some wrong details");
      return;
    }

    const successCode = readCSVFile(csvFile);
    if (successCode !== "error") setParsedCsv(true);

    setIsFormSubmitted(true);

    setBusinessName("");
    setIsCorrectBusinessName(false);
    setCsvFile({ type: false });
    setIsCorrectCsvFile(false);
    setErrorMessage("The form might be faulty.");
    setDisplayErrorMessage(false);
    setToDisplayButton(true);
  };

  useEffect(() => {
    setPageHasntLoaded(false);

    const isCorrectCompanyName =
      businessName.length > 3 &&
      (businessName.includes("AS") || businessName.includes("OÜ"));
    setBusinessName((name) => name.toUpperCase());
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
          message: `"${businessName}" isn't a correct business name. Make sure the name of the company is written correctly and contains the type of the business "OÜ" or "AS".`,
          fromWhere: "onNameChange",
        });
      }, 1500);
      return () => clearTimeout(waitingForUser);
    }
    setDisplayErrorMessage(false);
  }, [businessName, handleDisplayErrorMessage, isCorrectCsvFile, csvFile]);

  return (
    <>
      <form
        className="flex flex-col w-4/5 md:w-3/5 mx-auto"
        onSubmit={submitHandler}
        style={{
          display: pageHasntLoaded || isFormSubmitted ? "none" : "flex",
        }}
      >
        <div
          className="backdrop-blur-sm bg-white/20 rounded-md text-xl font-medium text-white p-2 mb-2"
          style={{ display: displayErrorMessage ? "block" : "none" }}
        >
          <p>{errorMessage}</p>
        </div>
        <label
          className="sm:text-left text-xl font-medium text-white sm:bg-clip-text sm:text-transparent sm:bg-gradient-to-r sm:from-white sm:to-pink-500"
          htmlFor="business-name"
        >
          Official name of Your Business
        </label>
        <input
          type="name"
          placeholder='For example "AABITS OÜ", needed for billing'
          id="business-name"
          name="businessName"
          required
          className="rounded-md py-1 px-2 mb-2 text-black font-medium focus:outline-none text-lg"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          style={{
            textShadow: isCorrectBusinessName ? "0 0 5px #B43A7A" : "none",
            boxShadow: isCorrectBusinessName ? "5px 4px 10px #B43A7A" : "none",
          }}
        />
        <label
          htmlFor="csv_file"
          className="bg-custom_black border-solid border-2 border-custom_purple text-black rounded-md mt-2 p-1 font-medium text-xl"
          style={{
            boxShadow: isCorrectCsvFile ? "5px 4px 10px #B43A7A" : "none",
          }}
        >
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-500"
            style={{
              textShadow: isCorrectCsvFile ? "0 0 5px #B43A7A" : "none",
            }}
          >
            Submit the correctly formatted CSV file here
          </span>
          <input
            type="file"
            required
            className="hidden"
            id="csv_file"
            name="file"
            onChange={(e) => onFileChange(e)}
          />
        </label>
        {toDisplayButton && (
          <button className="bg-custom_purple border-solid border-2 border-custom_black text-black sm:w-3/5 mx-auto rounded-md mt-4 p-1 font-medium text-xl">
            Run checks
          </button>
        )}
      </form>
      <div
        class="loader-container"
        style={{ display: pageHasntLoaded ? "block" : "none" }}
      >
        <div class="loader"></div>
      </div>
      <div style={{ display: isFormSubmitted ? "block" : "none" }}>
        <h3 className="text-2xl font-medium text-white">Form submitted</h3>
        {parsedCsv ? (
          <Link
            className="block my-4 bg-custom_purple border-solid border-2 border-custom_black text-black sm:w-3/5 mx-auto rounded-md mt-4 p-1 font-medium text-xl"
            href="/processing"
          >
            Proceed
          </Link>
        ) : (
          <p className="mx-auto w-4/5 text-xl text-white mt-4">
            An error occured parsing the file You provided, maybe check if its
            wrongly formatted and try again.
          </p>
        )}
      </div>
    </>
  );
};

export default Form;
