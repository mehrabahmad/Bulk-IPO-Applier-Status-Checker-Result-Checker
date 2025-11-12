import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CurrentIpo() {
  const [ipoData, setIpoData] = useState(null); // optional: store response data

  

  useEffect(() => {
    const payload = {
    filterFieldParams: [
      { key: "companyIssue.companyISIN.script", alias: "Scrip" }
      // Add more filters if needed
    ],
    filterDateParams: [
      { key: "minIssueOpenDate", condition: "", alias: "", value: "" }
      // Add more date filters if needed
    ],
    page: 1,
    size: 10,
    searchRoleViewConstants: "VIEW_APPLICABLE_SHARE"
  };
    // Declare async function inside useEffect
    async function fetchCurrentIpo() {
      try {
        const response = await axios.post(
          "https://webbackend.cdsc.com.np/api/meroShare/companyShare/applicableIssue/",
          payload,
          {
            headers: {
              "authorization": `${localStorage.getItem("savedToken")}`, // remove extra space
              "Content-Type": "application/json"
            }
          }
        );
        console.log(response.data);
        setIpoData(response.data); // optional: save data to state
      } catch (err) {
        console.error(err);
      }
    }

    fetchCurrentIpo(); // call the async function
  }, []); // empty dependency array to run once

  return (
    <div>
      Click the Apply button to apply the IPO
      {ipoData && <pre>{JSON.stringify(ipoData, null, 2)}</pre>} {/* optional: display fetched data */}
    </div>
  );
}

export default CurrentIpo;
