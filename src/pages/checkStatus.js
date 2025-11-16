import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function CheckStatus() {
  const location = useLocation();
  const users = location.state?.users;

  const [applicationReportList, setApplicationReportList] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [finalResult, setFinalresult] = useState([]);
  const [sellData, setSellData] = useState([])
  const [summary, setSummary] = useState({ total: 0, alloted: 0, verified: 0 });
  const [companyName, setCompanyName] = useState("");

  const payload = {
    filterFieldParams: [
      { key: "companyShare.companyIssue.companyISIN.script", alias: "Scrip" },
      { key: "companyShare.companyIssue.companyISIN.company.name", alias: "Company Name" },
    ],
    page: 1,
    size: 200,
    searchRoleViewConstants: "VIEW_APPLICANT_FORM_COMPLETE",
    filterDateParams: [
      { key: "appliedDate", condition: "", alias: "", value: "" },
      { key: "appliedDate", condition: "", alias: "", value: "" },
    ],
  };

  useEffect(() => {
    console.log("UseEffect Execuited")
    if (!users || users.length === 0) return;
    const payload = {
      filterFieldParams: [
        { key: "companyShare.companyIssue.companyISIN.script", alias: "Scrip" },
        { key: "companyShare.companyIssue.companyISIN.company.name", alias: "Company Name" },
      ],
      page: 1,
      size: 200,
      searchRoleViewConstants: "VIEW_APPLICANT_FORM_COMPLETE",
      filterDateParams: [
        { key: "appliedDate", condition: "", alias: "", value: "" },
        { key: "appliedDate", condition: "", alias: "", value: "" },
      ],
    };

    const fetchReportData = async () => {
      try {
        console.log("First User Logging to get Company List")
        const res1 = await axios.post(
          "https://webbackend.cdsc.com.np/api/meroShare/auth/",
          {
            clientId: users[0].clientId,
            username: users[0].username,
            password: users[0].password,
          }
        );

        if (res1.status === 200 && res1.data.message === "Log in successful.") {
          console.log("Logging Successfull, Navigated to Main Page")
          const savedToken = res1.headers["authorization"];
          localStorage.setItem("savedToken", savedToken);

          const res2 = await axios.post(
            "https://webbackend.cdsc.com.np/api/meroShare/applicantForm/active/search/",
            payload,
            {
              headers: {
                authorization: `${localStorage.getItem("savedToken")}`,
                "Content-Type": "application/json",
              },
            }
          );

          setApplicationReportList(res2.data.object);

          if (res2.status === 200) { console.log("Company List Fetching Completed") }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchReportData();
  }, [users]);

  const handleCompanyChange = (e) => setSelectedCompanyId(e.target.value);


  const handleButtonClick = async () => {
    if (!selectedCompanyId) {
      alert("Please select a company first!");
      return;
    }
    let totalUsers = users.length;
    let totalAlloted = 0;
    let totalVerified = 0;

    const getCompanyName = (companyId) => {
      const company = applicationReportList.find(
        (c) => c.companyShareId.toString() === companyId.toString()
      );
      return company ? company.companyName : "Unknown Company";
    };
    setCompanyName(getCompanyName(selectedCompanyId));

    setSummary({ total: 0, alloted: 0, verified: 0, stageName: "" });
    setSellData([])
    setFinalresult([]); // Reset results
    for (let i = 0; i < users.length; i++) {
      const { name, clientId, username, password, tms } = users[i] || {};

      if (clientId && username && password) {
        await new Promise((resolve) => setTimeout(resolve, 10000));

        try {
          const res1 = await axios.post(
            "https://webbackend.cdsc.com.np/api/meroShare/auth/",
            { clientId, username, password }
          );


          if (res1.status === 200) {
            if (res1.data.message === "Log in successful.") {
              const savedToken = res1.headers["authorization"];
              localStorage.setItem("savedToken", savedToken);

              const res2 = await axios.post(
                "https://webbackend.cdsc.com.np/api/meroShare/applicantForm/active/search/",
                payload,
                {
                  headers: {
                    authorization: `${localStorage.getItem("savedToken")}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              const filteredReport = res2.data.object.filter(
                (app) => app.companyShareId.toString() === selectedCompanyId
              );

              if (filteredReport.length === 1) {
                const applicantFormId = filteredReport[0].applicantFormId;
                const res3 = await axios.get(
                  `https://webbackend.cdsc.com.np/api/meroShare/applicantForm/report/detail/${applicantFormId}`,
                  {
                    headers: {
                      authorization: `${localStorage.getItem("savedToken")}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                const statusName = res3.data.statusName || "Not Alloted";
                const stageName = res3.data.stageName || "";
                if (statusName === "Alloted" && stageName === "SHARED_RESULT_UPLOADED") {

                  totalAlloted++;
                  setSellData((prev) => {
                    const updated = [...prev, { name, username, tms }];
                    console.log("Added new allotment:", updated);
                    return updated;
                  });
                }
                if (stageName === "ALLOTMENT_DUMPED") {
                  if (statusName === "Verified") {
                    totalVerified++
                  }
                }

                const allotedKitta = res3.data.receivedKitta || 0;
                setFinalresult((prev) => [...prev, { name, statusName, allotedKitta },]);
              } else {
                setFinalresult((prev) => [
                  ...prev,
                  { name, statusName: "Not Applied", allotedKitta: 0 },
                ]);
              }

            }
            else {
              setFinalresult((prev) => [...prev, { name, statusName: res1.data.message },]);
            }



          }
        } catch (err) {
          console.log(err.response?.data?.message || err.message);
          setFinalresult((prev) => [
            ...prev,
            { name, statusName: err.response?.data?.message || "Error", allotedKitta: 0 },
          ]);
        }

      }


    }

    setSummary({
      total: totalUsers,
      alloted: totalAlloted,
      verified: totalVerified
    });
  };



  const getStatusColor = (status) => {
    if (!status) return "bg-gray-50 text-gray-800";

    const normalized = status.toLowerCase();

    if (normalized.includes("not applied"))
      return "bg-yellow-500 border-yellow-300";

    if (normalized.includes("not alloted"))
      return "bg-red-700 border-red-300";

    if (normalized.includes("verified") || normalized.includes("alloted"))
      return "bg-green-600 border-green-300";

    return "bg-blue-600 border-gray-200";
  };

  const downloadSellData = () => {
    if (sellData.length === 0) return;

    let content = companyName + "\n";

    sellData.forEach((user, i) => {
      content += `${i + 1}. ${user.name}\t\t${user.username}\t${user.tms}\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sell_data.txt";
    link.click();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Check IPO Status</h1>

      {users && users.length > 0 && (
        <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg mb-8">
          <select
            value={selectedCompanyId}
            onChange={handleCompanyChange}
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select Company</option>
            {applicationReportList.map((company) => (
              <option key={company.companyShareId} value={company.companyShareId}>
                {company.companyName} ({company.scrip})
              </option>
            ))}
          </select>

          <button
            onClick={handleButtonClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition duration-300"
          >
            Check Status
          </button>
        </div>
      )}

      {finalResult.length > 0 && (
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            User Application Status
          </h2>
          {(summary.alloted > 0 || summary.verified > 0) && <div className="mt-8 text-center text-gray-700 font-medium">
            <h3 className="text-1xl font-bold text-center">Total Users: {summary.total}</h3>
            {summary.alloted > 0 && <h3 className="text-1xl font-bold text-center">Alloted Users: {summary.alloted}</h3>}
            {summary.verified > 0 && <h3 className="text-1xl font-bold text-center">Verified Users: {summary.verified}</h3>}
            {sellData.length > 0 && (
              <div className="text-center mt-6">
                <button
                  onClick={downloadSellData}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow"
                >
                  Download Sell Data (TXT)
                </button>
              </div>
            )}
          </div>}


          <br></br>


          <ul className="space-y-4">
            {finalResult.map((user, index) => (
              <li
                key={index}
                className={`flex justify-between items-center p-5 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 ${getStatusColor(
                  user.statusName
                )}`}
              >
                {/* User Name */}
                <span className="font-semibold text-gray-800 text-lg">
                  {user.name}
                </span>

                {/* Status & Kitta */}
                <div className="flex flex-col items-end text-right">
                  <span className="px-4 py-1.5 font-bold rounded-full text-sm text-gray-800">
                    {user.statusName}
                  </span>

                  {/* Only show if kitta > 0 */}
                  {Number(user.allotedKitta) > 0 && (
                    <span className="text-sm font-medium text-indigo-700 mt-1">
                      🎉 Alloted Kitta:{" "}
                      <span className="font-semibold">{user.allotedKitta}</span>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CheckStatus;