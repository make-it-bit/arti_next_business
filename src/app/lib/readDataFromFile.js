const readCSVFile = (file) => {
  let parsedData = [];
  try {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (e) => {
      const csvdata = e.target.result;
      const rowData = csvdata.split("\n");

      let i = 1;
      while (i < rowData.length) {
        const dataByRow = rowData[i].split(",");
        parsedData.push({
          name: dataByRow[0],
          website: dataByRow[1],
          used: dataByRow[2] == "1",
          new: dataByRow[3] == "1",
          carParkSize: dataByRow[4],
          officialName: dataByRow[5]?.replace("\r", ""),
          registerCode: dataByRow[6]?.replace("\r", ""),
          index: i,
        });
        i++;
      }
    };
    return parsedData;
  } catch (e) {
    return parsedData;
  }
};

export default readCSVFile;
