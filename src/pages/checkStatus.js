import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function CheckStatus() {
  const location = useLocation();
  const users = location.state?.users;

  const [applicationReportList, setApplicationReportList] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [finalResult, setFinalresult] = useState([]);

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
    if (!users || users.length === 0) return;

    const fetchReportData = async () => {
      try {
        const res1 = await axios.post(
          "https://webbackend.cdsc.com.np/api/meroShare/auth/",
          {
            clientId: users[0].clientId,
            username: users[0].username,
            password: users[0].password,
          }
        );

        if (res1.status === 200 && res1.data.message === "Log in successful.") {
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

    setFinalresult([]); // Reset results
    for (let i = 0; i < users.length; i++) {
      const { name, clientId, username, password } = users[i] || {};

      await new Promise((resolve) => setTimeout(resolve, 4000));

      try {
        const res1 = await axios.post(
          "https://webbackend.cdsc.com.np/api/meroShare/auth/",
          { clientId, username, password }
        );

        if (res1.status === 200 && res1.data.message === "Log in successful.") {
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
            const allotedKitta = res3.data.receivedKitta || 0;

            setFinalresult((prev) => [
              ...prev,
              { name, statusName, allotedKitta },
            ]);
          }
          else {
            setFinalresult((prev) => [
              ...prev,
              { name, statusName: "Not Applied", allotedKitta: 0 },
            ]);
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
  };

 const getStatusColor = (status) => {
    if (!status) return "bg-gray-50 text-gray-800";

    const normalized = status.toLowerCase();

    if (normalized.includes("verified") || normalized.includes("allotted"))
      return "bg-green-600 border-green-300";

    if (normalized.includes("not applied"))
      return "bg-yellow-500 border-yellow-300";

    if (normalized.includes("not alloted") || normalized.includes("not allotted"))
      return "bg-red-700 border-red-300";

    return "bg-green-600 border-gray-200";
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