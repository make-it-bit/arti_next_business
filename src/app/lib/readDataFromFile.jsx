export const readCSVFile = (file) => {
  try {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (e) => {
      let parsedData = {};
      const csvdata = e.target.result;
      const rowData = csvdata.split("\n");

      let i = 1;
      while (i < rowData.length) {
        const dataByRow = rowData[i].split(",");
        parsedData[`i${i}`] = {
          name: dataByRow[0],
          website: dataByRow[1],
          used: dataByRow[2] == "1",
          new: dataByRow[3] == "1",
          carParkSize: dataByRow[4],
          officialName: dataByRow[5].replace("\r", ""),
          index: i,
        };
        i++;
      }
      const jsonData = JSON.stringify(parsedData);
      localStorage.setItem("carDealers", jsonData);
      return "good";
    };
    return "error";
  } catch (e) {
    alert("error");
    return "error";
  }
};
