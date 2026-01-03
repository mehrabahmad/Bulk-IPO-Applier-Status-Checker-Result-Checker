

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function CheckStatus() {
  const API=process.env.REACT_APP_BACKEND_BASE_LINK;
  const stopRef = useRef(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [applicationReportList, setApplicationReportList] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [finalResult, setFinalresult] = useState([]);
  const [sellData, setSellData] = useState([]);
  const [summary, setSummary] = useState({ total: 0, checked: 0, verified: 0, unverified: 0, rejected: 0, alloted: 0 });
  const [companyName, setCompanyName] = useState("");
  const [isAllotmentDone, setIsAllotmentDone] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const token = localStorage.getItem("token");

 const payload = useMemo(() => ({
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
  }), []);

  const saveVerifiedUsers = async (companyId, clientId, username ) => {
      // Record Verified User in backend
          try {
             await axios.post(`${API}/verifiedHistory/insertRecordofVerifiedUser`,
              {
                companyId,
                clientId,
                username
              }
            );
          } catch (err) {
            alert("Something went wrong");
          }
    }




  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
        if (res.data.length === 0) {
          alert("No users found. Please add users first.");
          navigate("/users");
        }
      } catch {
        navigate("/");
      }
    };
    fetchUsers();
  }, [navigate, token]);

  /* ================= FETCH COMPANY LIST ================= */
  useEffect(() => {
    if (!users || users.length === 0) return;

    const fetchCompanyList = async () => {
      try {
        const firstUser = users[0];
        const res1 = await axios.post(
          "https://webbackend.cdsc.com.np/api/meroShare/auth/",
          {
            clientId: firstUser.clientId,
            username: firstUser.username,
            password: firstUser.password,
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
                authorization: savedToken,
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

    fetchCompanyList();
  }, [users, payload]);

  const handleCompanyChange = (e) => setSelectedCompanyId(e.target.value);

  /* ================= CHECK STATUS ================= */
  const handleButtonClick = async () => {
    if (!selectedCompanyId) {
      alert("Please select a company first!");
      return;
    }
    setIsAllotmentDone(false);

    let totalUsers = users.length;
    let totalChecked = 0;
    let totalAlloted = 0;
    let totalVerified = 0;
    let totalUnverified = 0;
    let totalRejected = 0;


    const getCompanyName = (companyId) => {
      const company = applicationReportList.find(
        (c) => c.companyShareId.toString() === companyId.toString()
      );
      return company ? company.companyName : "Unknown Company";
    };
    setCompanyName(getCompanyName(selectedCompanyId));

    setSummary({ total: totalUsers, checked: 0, verified: 0, unverified: 0, rejected: 0, alloted: 0 });
    setSellData([]);
    setFinalresult([]);
    setIsRunning(true);

    const res = await axios.get(
      `${API}/verifiedHistory/${selectedCompanyId}`
    );
    const verifiedUsers = res.data;
    console.log(verifiedUsers)
    
    
    
    for (let i = 0; i < users.length; i++) {
      const { name, clientId, username, password, tms } = users[i] || {};
      if (!clientId || !username || !password) continue;

      //Check if already verified
      const clientKey = `${clientId}_${username}`;
      if (verifiedUsers.includes(clientKey)) { 
        await new Promise((resolve) => setTimeout(resolve, 300));
        totalChecked++;
        totalVerified++;
        setFinalresult((prev) => [...prev, { name, statusName: "Already Verified (History)", allotedKitta: 0 }]);
        setSummary({ total: totalUsers, checked: totalChecked, verified: totalVerified, unverified: totalUnverified, rejected: totalRejected });
        continue;
      }
      

      //Delay
      for (let j = 0; j < 30; j++) {
        if (stopRef.current) { stopRef.current = false; setIsRunning(false); return; }
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      totalChecked++;

      try {
        const res1 = await axios.post(
          "https://webbackend.cdsc.com.np/api/meroShare/auth/",
          { clientId, username, password }
        );

        if (res1.status === 200 && res1.data.message === "Log in successful.") {
          const savedToken = res1.headers["authorization"];
          localStorage.setItem("savedToken", savedToken);

          if (stopRef.current) { stopRef.current = false; setIsRunning(false); return; }

          const res2 = await axios.post(
            "https://webbackend.cdsc.com.np/api/meroShare/applicantForm/active/search/",
            payload,
            {
              headers: { authorization: savedToken, "Content-Type": "application/json" },
            }
          );

          const filteredReport = res2.data.object.filter(
            (app) => app.companyShareId.toString() === selectedCompanyId
          );

          if (filteredReport.length === 1) {
            const applicantFormId = filteredReport[0].applicantFormId;

            if (stopRef.current) { stopRef.current = false; setIsRunning(false); return; }

            const res3 = await axios.get(
              `https://webbackend.cdsc.com.np/api/meroShare/applicantForm/report/detail/${applicantFormId}`,
              { headers: { authorization: savedToken, "Content-Type": "application/json" } }
            );

            const statusName = res3.data.statusName || "Not Alloted";
            const allotedKitta = res3.data.receivedKitta || 0;
            const stageName = res3.data.stageName || "";

            if (stageName === "SHARED_RESULT_UPLOADED") {
              setIsAllotmentDone(true);

              if (statusName === "Alloted") {
                totalAlloted++;
                setSellData((prev) => [...prev, { name, username, tms }]);
              }
              setFinalresult((prev) => [...prev, { name, statusName, allotedKitta }]);

              setSummary({ total: totalUsers, checked: totalChecked, alloted: totalAlloted });
              continue

            }
            else {
              if (statusName === "Verified" || statusName === "Unverified" || statusName === "Rejected") {
                if (statusName === "Verified") {
                  totalVerified++;
                  await saveVerifiedUsers(selectedCompanyId, clientId, username);
                }
                if (statusName === "Unverified") {
                  totalUnverified++;
                }
                if (statusName === "Rejected") {
                  totalRejected++;
                }
                setFinalresult((prev) => [...prev, { name, statusName, allotedKitta }]);

                setSummary({ total: totalUsers, checked: totalChecked, verified: totalVerified, unverified: totalUnverified, rejected: totalRejected });
                continue
              }
            }







          } else {
            setFinalresult((prev) => [...prev, { name, statusName: "Not Applied", allotedKitta: 0 }]);
          }

          setSummary({ total: totalUsers, checked: totalChecked });

        } else {
          setFinalresult((prev) => [...prev, { name, statusName: res1?.data?.message || "Login Failed", allotedKitta: 0 }]);
        }
      } catch (err) {
        setFinalresult((prev) => [
          ...prev,
          { name, statusName: err.response?.data?.message || "Error", allotedKitta: 0 },
        ]);
      }
    }
    setIsRunning(false);

  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-50 text-gray-800";
    const normalized = status.toLowerCase();
    if (normalized.includes("not applied")) return "bg-yellow-500 border-yellow-300";
    if (normalized.includes("unverified")) return "bg-yellow-500 border-yellow-300";
    if (normalized.includes("not alloted") || normalized.includes("rejected")) return "bg-red-700 border-red-300";
    if (normalized.includes("verified") || normalized.includes("alloted")) return "bg-green-600 border-green-300";
    return "bg-blue-600 border-gray-200";
  };

  const downloadSellData = () => {
    if (sellData.length === 0) return;
    let content = companyName + "\n";
    sellData.forEach((user, i) => {
      content += `${i + 1}. ${user.name}\t${user.username}\t${user.tms}\n`;
    });
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sell_data.txt";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            className="text-xl font-bold text-blue-600 cursor-pointer hover:opacity-80"
            onClick={() => navigate("/home")}
          >
            IPO Dashboard
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/home")}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/", { replace: true });
              }}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Check IPO Status
        </h1>

        {/* COMPANY SELECT */}
        {users.length > 0 && (
          <div className="bg-white max-w-xl mx-auto p-6 rounded-2xl shadow-lg">
            <select
              value={selectedCompanyId}
              onChange={handleCompanyChange}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Company</option>
              {applicationReportList.map((company) => (
                <option
                  key={company.companyShareId}
                  value={company.companyShareId}
                >
                  {company.companyName} ({company.scrip})
                </option>
              ))}
            </select>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={handleButtonClick}
                disabled={isRunning}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow"
              >
                Check Status
              </button>

              <button
                onClick={() => (stopRef.current = true)}
                disabled={!isRunning}
                className={`flex-1 font-semibold py-3 rounded-lg shadow
                ${!isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"}`}
              >
                Stop
              </button>

            </div>
          </div>
        )}

        {/* SUMMARY */}
        {(summary.total > 0 || finalResult.length > 0) && (
          <div className="max-w-4xl mx-auto mt-10 bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Application Summary
            </h2>



            <div className={`grid grid-cols-2 ${isAllotmentDone ? "md:grid-cols-3" : "md:grid-cols-5"} gap-4`}>
              {(isAllotmentDone ? [
                { label: "Total", value: summary.total, color: "bg-gray-100" },
                { label: "Checked", value: summary.checked, color: "bg-blue-100" },
                { label: "Alloted", value: summary.alloted, color: "bg-green-100" },
              ] : [{ label: "Total", value: summary.total, color: "bg-gray-100" },
              { label: "Checked", value: summary.checked, color: "bg-blue-100" },
              { label: "Verified", value: summary.verified, color: "bg-emerald-100" },
              { label: "Unverified", value: summary.unverified, color: "bg-yellow-100" },
              { label: "Rejected", value: summary.rejected, color: "bg-red-100" },]).map((item, i) => (
                <div key={i} className={`p-4 rounded-xl text-center ${item.color}`}>
                  <p className="text-sm text-gray-600">{item.label}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            <br></br>

            {/* DOWNLOAD BUTTON */}

            {sellData.length > 0 && (
              <div className="text-center mb-6">
                <button
                  onClick={downloadSellData}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
                >
                  Download Sell Data (TXT)
                </button>
              </div>
            )}

            <br></br>

            {/* RESULTS LIST */}
            <ul className="space-y-4">
              {finalResult.map((user, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center p-5 rounded-xl border shadow-sm ${getStatusColor(
                    user.statusName
                  )}`}
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    {/* SN */}
                    <span className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                      {index + 1}
                    </span>

                    {/* NAME */}
                    <span className="font-semibold text-lg text-gray-800">
                      {user.name}
                    </span>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right">
                    <span className="font-bold">{user.statusName}</span>
                    {Number(user.allotedKitta) > 0 && (
                      <p className="text-sm text-indigo-700 font-medium">
                        🎉 Alloted Kitta: {user.allotedKitta}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );

}

export default CheckStatus;