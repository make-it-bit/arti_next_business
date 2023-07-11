import React from "react";

import Link from "next/link";

const ResultsDisplayer = ({ results }) => {
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
  return (
    <div>
      <h2>Results</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <div>
              <h3>{result.name}</h3>
              <p>{results.officialName}</p>
            </div>
            <div>
              <p>Business details:</p>
              <p>Car park size: {result.carParkSize} cars</p>
              <p>
                Sells {result.new ? "new cars" : "doesn't sell new cars"} and{" "}
                {result.used ? "used cars" : "doesn't sell used cars"}.
              </p>
              <p>Taxed revenue: {result.businessDetails.taxedRevenue}</p>
              <p>
                Amount of employees: {result.businessDetails.amountOfEmployees}
              </p>
              <p>Register code: {result.registerCode}</p>
            </div>
            <div>
              <p>Representatives:</p>
              <ul>
                {result.contactDetails.map((person, index) => (
                  <li key={index}>{person}</li>
                ))}
              </ul>
            </div>
            <div>
              <p>Contact:</p>
              <Link
                href={result.rikUrl}
                title="Company's business register page"
              >
                {result.name}&apos;s business register page
              </Link>
              <Link href={result.website} title="Companys personal website">
                {result.name}&apos;s personal website
              </Link>
              <p>Address: {result.contactDetails.address}</p>
              <p>Email: {result.contactDetails.email}</p>
              <p>Phonenumber: {result.contactDetails.phoneNumber}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsDisplayer;
