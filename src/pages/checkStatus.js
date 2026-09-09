

// import React, { useEffect, useState, useRef, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";


// function CheckStatus() {
//   const API=process.env.REACT_APP_BACKEND_BASE_LINK;
//   const stopRef = useRef(false);
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [applicationReportList, setApplicationReportList] = useState([]);
//   const [selectedCompanyId, setSelectedCompanyId] = useState("");
//   const [finalResult, setFinalresult] = useState([]);
//   const [sellData, setSellData] = useState([]);
//   const [summary, setSummary] = useState({ total: 0, checked: 0, verified: 0, unverified: 0, rejected: 0, alloted: 0 });
//   const [companyName, setCompanyName] = useState("");
//   const [isAllotmentDone, setIsAllotmentDone] = useState(false);
//   const [isRunning, setIsRunning] = useState(false);

//   const token = localStorage.getItem("token");

//  const payload = useMemo(() => ({
//     filterFieldParams: [
//       { key: "companyShare.companyIssue.companyISIN.script", alias: "Scrip" },
//       { key: "companyShare.companyIssue.companyISIN.company.name", alias: "Company Name" },
//     ],
//     page: 1,
//     size: 200,
//     searchRoleViewConstants: "VIEW_APPLICANT_FORM_COMPLETE",
//     filterDateParams: [
//       { key: "appliedDate", condition: "", alias: "", value: "" },
//       { key: "appliedDate", condition: "", alias: "", value: "" },
//     ],
//   }), []);

//   const saveVerifiedUsers = async (companyId, clientId, username ) => {
//       // Record Verified User in backend
//           try {
//              await axios.post(`${API}/verifiedHistory/insertRecordofVerifiedUser`,
//               {
//                 companyId,
//                 clientId,
//                 username
//               }
//             );
//           } catch (err) {
//             alert("Something went wrong");
//           }
//     }




//   /* ================= FETCH USERS ================= */
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get(`${API}/users`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsers(res.data);
//         if (res.data.length === 0) {
//           alert("No users found. Please add users first.");
//           navigate("/users");
//         }
//       } catch {
//         navigate("/");
//       }
//     };
//     fetchUsers();
//   }, [API, navigate, token]);

//   /* ================= FETCH COMPANY LIST ================= */
//   useEffect(() => {
//     if (!users || users.length === 0) return;

//     const fetchCompanyList = async () => {
//       try {
//         const firstUser = users[0];
//         const res1 = await axios.post(
//           "https://webbackend.cdsc.com.np/api/meroShare/auth/",
//           {
//             clientId: firstUser.clientId,
//             username: firstUser.username,
//             password: firstUser.password,
//           }
//         );

//         if (res1.status === 200 && res1.data.message === "Log in successful.") {
//           const savedToken = res1.headers["authorization"];
//           localStorage.setItem("savedToken", savedToken);

//           const res2 = await axios.post(
//             "https://webbackend.cdsc.com.np/api/meroShare/applicantForm/active/search/",
//             payload,
//             {
//               headers: {
//                 authorization: savedToken,
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           setApplicationReportList(res2.data.object);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchCompanyList();
//   }, [users, payload]);

//   const handleCompanyChange = (e) => setSelectedCompanyId(e.target.value);

//   /* ================= CHECK STATUS ================= */
//   const handleButtonClick = async () => {
//     if (!selectedCompanyId) {
//       alert("Please select a company first!");
//       return;
//     }
//     setIsAllotmentDone(false);

//     let totalUsers = users.length;
//     let totalChecked = 0;
//     let totalAlloted = 0;
//     let totalVerified = 0;
//     let totalUnverified = 0;
//     let totalRejected = 0;

 
//     const getCompanyName = (companyId) => {
//       const company = applicationReportList.find(
//         (c) => c.companyShareId.toString() === companyId.toString()
//       );
      
//       return company ? company.companyName : "Unknown Company";
//     };
  
//     setCompanyName(getCompanyName(selectedCompanyId));

//     setSummary({ total: totalUsers, checked: 0, verified: 0, unverified: 0, rejected: 0, alloted: 0 });
//     setSellData([]);
//     setFinalresult([]);
//     setIsRunning(true);

//     const res = await axios.get(
//       `${API}/verifiedHistory/${selectedCompanyId}`
//     );
//     const verifiedUsers = res.data;
//     console.log(verifiedUsers)
    
    
    
//     for (let i = 0; i < users.length; i++) {
//       const { name, clientId, username, password, tms } = users[i] || {};
//       if (!clientId || !username || !password) continue;

//       // Check if already verified
//       const clientKey = `${clientId}_${username}`;
//       if (verifiedUsers.includes(clientKey)) { 
//         await new Promise((resolve) => setTimeout(resolve, 200));
//         totalChecked++;
//         totalVerified++;
//         setFinalresult((prev) => [...prev, { name, statusName: "Already Verified (History)", allotedKitta: 0 }]);
//         setSummary({ total: totalUsers, checked: totalChecked, verified: totalVerified, unverified: totalUnverified, rejected: totalRejected });
//         continue;
//       }
      

//       //Delay
//       for (let j = 0; j < 30; j++) {
//         if (stopRef.current) { stopRef.current = false; setIsRunning(false); return; }
//         await new Promise((resolve) => setTimeout(resolve, 200));
//       }

//       totalChecked++;

//       try {
//         const res1 = await axios.post(
//           "https://webbackend.cdsc.com.np/api/meroShare/auth/",
//           { clientId, username, password }
//         );

//         if (res1.status === 200 && res1.data.message === "Log in successful.") {
//           const savedToken = res1.headers["authorization"];
//           localStorage.setItem("savedToken", savedToken);

//           if (stopRef.current) { stopRef.current = false; setIsRunning(false); return; }

//           const res2 = await axios.post(
//             "https://webbackend.cdsc.com.np/api/meroShare/applicantForm/active/search/",
//             payload,
//             {
//               headers: { authorization: savedToken, "Content-Type": "application/json" },
//             }
//           );

//           const filteredReport = res2.data.object.filter(
//             (app) => app.companyShareId.toString() === selectedCompanyId
//           );

//           if (filteredReport.length === 1) {
//             const applicantFormId = filteredReport[0].applicantFormId;

//             if (stopRef.current) { stopRef.current = false; setIsRunning(false); return; }

//             const res3 = await axios.get(
//               `https://webbackend.cdsc.com.np/api/meroShare/applicantForm/report/detail/${applicantFormId}`,
//               { headers: { authorization: savedToken, "Content-Type": "application/json" } }
//             );

//             const statusName = res3.data.statusName || "Not Alloted";
//             const allotedKitta = res3.data.receivedKitta || 0;
//             const stageName = res3.data.stageName || "";

//             if (stageName === "SHARED_RESULT_UPLOADED" || stageName === "ALLOTMENT_RESULT_APPROVED" || stageName === "SHARE_RESULT_DUMPED") {
//               setIsAllotmentDone(true);

//               if (statusName === "Alloted") {
//                 totalAlloted++;
//                 setSellData((prev) => [...prev, { name, username, tms }]);
//               }
//               setFinalresult((prev) => [...prev, { name, statusName, allotedKitta }]);

//               setSummary({ total: totalUsers, checked: totalChecked, alloted: totalAlloted });
//               continue

//             }
//             else {
//               if (statusName === "Verified" || statusName === "Unverified" || statusName === "Rejected") {
//                 if (statusName === "Verified") {
//                   totalVerified++;
//                   await saveVerifiedUsers(selectedCompanyId, clientId, username);
//                 }
//                 if (statusName === "Unverified") {
//                   totalUnverified++;
//                 }
//                 if (statusName === "Rejected") {
//                   totalRejected++;
//                 }
//                 setFinalresult((prev) => [...prev, { name, statusName, allotedKitta }]);

//                 setSummary({ total: totalUsers, checked: totalChecked, verified: totalVerified, unverified: totalUnverified, rejected: totalRejected });
//                 continue
//               }
//             }







//           } else {
//             setFinalresult((prev) => [...prev, { name, statusName: "Not Applied", allotedKitta: 0 }]);
//           }

//           setSummary({ total: totalUsers, checked: totalChecked });

//         } else {
//           setFinalresult((prev) => [...prev, { name, statusName: res1?.data?.message || "Login Failed", allotedKitta: 0 }]);
//         }
//       } catch (err) {
//         setFinalresult((prev) => [
//           ...prev,
//           { name, statusName: err.response?.data?.message || "Error", allotedKitta: 0 },
//         ]);
//       }
//     }
//     setIsRunning(false);

//   };

//   const getStatusColor = (status) => {
//     if (!status) return "bg-gray-50 text-gray-800";
//     const normalized = status.toLowerCase();
//     if (normalized.includes("not applied")) return "bg-yellow-500 border-yellow-300";
//     if (normalized.includes("unverified")) return "bg-yellow-500 border-yellow-300";
//     if (normalized.includes("not alloted") || normalized.includes("rejected")) return "bg-red-700 border-red-300";
//     if (normalized.includes("verified") || normalized.includes("alloted")) return "bg-green-600 border-green-300";
//     return "bg-blue-600 border-gray-200";
//   };

//   const downloadSellData = () => {
//     if (sellData.length === 0) return;
//     let content = companyName + "\n";
//     sellData.forEach((user, i) => {
//       content += `${i + 1}. ${user.name}\t${user.username}\t${user.tms}\n`;
//     });
//     const blob = new Blob([content], { type: "text/plain" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "sell_data.txt";
//     link.click();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
//       {/* NAVBAR */}
//       <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           <h1
//             className="text-xl font-bold text-blue-600 cursor-pointer hover:opacity-80"
//             onClick={() => navigate("/home")}
//           >
//             IPO Dashboard
//           </h1>
//           <div className="flex gap-3">
//             <button
//               onClick={() => navigate("/home")}
//               className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
//             >
//               Home
//             </button>
//             <button
//               onClick={() => {
//                 localStorage.removeItem("token");
//                 navigate("/", { replace: true });
//               }}
//               className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* MAIN */}
//       <main className="max-w-5xl mx-auto px-6 py-10">
//         <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
//           Check IPO Status
//         </h1>

//         {/* COMPANY SELECT */}
//         {users.length > 0 && (
//           <div className="bg-white max-w-xl mx-auto p-6 rounded-2xl shadow-lg">
//             <select
//               value={selectedCompanyId}
//               onChange={handleCompanyChange}
//               className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-400"
//             >
//               <option value="">Select Company</option>
//               {applicationReportList.map((company) => (
//                 <option
//                   key={company.companyShareId}
//                   value={company.companyShareId}
//                 >
//                   {company.companyName} ({company.scrip})
//                 </option>
//               ))}
//             </select>

//             {/* ACTION BUTTONS */}
//             <div className="flex gap-3">
//               <button
//                 onClick={handleButtonClick}
//                 disabled={isRunning}
//                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow"
//               >
//                 Check Status
//               </button>

//               <button
//                 onClick={() => (stopRef.current = true)}
//                 disabled={!isRunning}
//                 className={`flex-1 font-semibold py-3 rounded-lg shadow
//                 ${!isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"}`}
//               >
//                 Stop
//               </button>

//             </div>
//           </div>
//         )}

//         {/* SUMMARY */}
//         {(summary.total > 0 || finalResult.length > 0) && (
//           <div className="max-w-4xl mx-auto mt-10 bg-white rounded-3xl shadow-xl p-8">
//             <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//               Application Summary
//             </h2>



//             <div className={`grid grid-cols-2 ${isAllotmentDone ? "md:grid-cols-3" : "md:grid-cols-5"} gap-4`}>
//               {(isAllotmentDone ? [
//                 { label: "Total", value: summary.total, color: "bg-gray-100" },
//                 { label: "Checked", value: summary.checked, color: "bg-blue-100" },
//                 { label: "Alloted", value: summary.alloted, color: "bg-green-100" },
//               ] : [{ label: "Total", value: summary.total, color: "bg-gray-100" },
//               { label: "Checked", value: summary.checked, color: "bg-blue-100" },
//               { label: "Verified", value: summary.verified, color: "bg-emerald-100" },
//               { label: "Unverified", value: summary.unverified, color: "bg-yellow-100" },
//               { label: "Rejected", value: summary.rejected, color: "bg-red-100" },]).map((item, i) => (
//                 <div key={i} className={`p-4 rounded-xl text-center ${item.color}`}>
//                   <p className="text-sm text-gray-600">{item.label}</p>
//                   <p className="text-2xl font-bold">{item.value}</p>
//                 </div>
//               ))}
//             </div>

//             <br></br>

//             {/* DOWNLOAD BUTTON */}

//             {sellData.length > 0 && (
//               <div className="text-center mb-6">
//                 <button
//                   onClick={downloadSellData}
//                   className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
//                 >
//                   Download Sell Data (TXT)
//                 </button>
//               </div>
//             )}

//             <br></br>

//             {/* RESULTS LIST */}
//             <ul className="space-y-4">
//               {finalResult.map((user, index) => (
//                 <li
//                   key={index}
//                   className={`flex justify-between items-center p-5 rounded-xl border shadow-sm ${getStatusColor(
//                     user.statusName
//                   )}`}
//                 >
//                   {/* LEFT */}
//                   <div className="flex items-center gap-4">
//                     {/* SN */}
//                     <span className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
//                       {index + 1}
//                     </span>

//                     {/* NAME */}
//                     <span className="font-semibold text-lg text-gray-800">
//                       {user.name}
//                     </span>
//                   </div>

//                   {/* RIGHT */}
//                   <div className="text-right">
//                     <span className="font-bold">{user.statusName}</span>
//                     {Number(user.allotedKitta) > 0 && (
//                       <p className="text-sm text-indigo-700 font-medium">
//                         🎉 Alloted Kitta: {user.allotedKitta}
//                       </p>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </main>
//     </div>
//   );

// }

// export default CheckStatus;


import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CheckStatus() {
  const API = process.env.REACT_APP_BACKEND_BASE_LINK;

  const stopRef = useRef(false);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [applicationReportList, setApplicationReportList] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const [finalResult, setFinalresult] = useState([]);
  const [sellData, setSellData] = useState([]);

  const [summary, setSummary] = useState({
    total: 0,
    checked: 0,
    verified: 0,
    unverified: 0,
    rejected: 0,
    alloted: 0,
    notAlloted: 0,
  });

  const [companyName, setCompanyName] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const [checkMode, setCheckMode] = useState("checkStatus");

  const token = localStorage.getItem("token");

  /* =========================================================
     PAYLOAD
  ========================================================= */
  const payload = useMemo(
    () => ({
      filterFieldParams: [
        {
          key: "companyShare.companyIssue.companyISIN.script",
          alias: "Scrip",
        },
        {
          key: "companyShare.companyIssue.companyISIN.company.name",
          alias: "Company Name",
        },
      ],
      page: 1,
      size: 200,
      searchRoleViewConstants: "VIEW_APPLICANT_FORM_COMPLETE",
      filterDateParams: [
        {
          key: "appliedDate",
          condition: "",
          alias: "",
          value: "",
        },
        {
          key: "appliedDate",
          condition: "",
          alias: "",
          value: "",
        },
      ],
    }),
    []
  );

  /* =========================================================
     SAVE VERIFIED USER
  ========================================================= */
  const saveVerifiedUsers = async (companyId, clientId, username) => {
    try {
      await axios.post(
        `${API}/verifiedHistory/insertRecordofVerifiedUser`,
        {
          companyId,
          clientId,
          username,
        }
      );
    } catch (err) {
      console.log("Failed to save verified user:", err);
    }
  };

  /* =========================================================
     FETCH USERS
  ========================================================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(res.data);

        if (res.data.length === 0) {
          alert("No users found. Please add users first.");
          navigate("/users");
        }
      } catch (err) {
        console.log(err);
        navigate("/");
      }
    };

    fetchUsers();
  }, [API, navigate, token]);

  /* =========================================================
     FETCH COMPANY LIST
  ========================================================= */
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

        if (
          res1.status === 200 &&
          res1.data.message === "Log in successful."
        ) {
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

          setApplicationReportList(res2.data.object || []);
        }
      } catch (err) {
        console.log("Company list error:", err);
      }
    };

    fetchCompanyList();
  }, [users, payload]);

  /* =========================================================
     COMPANY CHANGE
  ========================================================= */
  const handleCompanyChange = (e) => {
    setSelectedCompanyId(e.target.value);
  };

  /* =========================================================
     CHECK STATUS / RESULT
  ========================================================= */
  const handleButtonClick = async () => {
    if (!selectedCompanyId) {
      alert("Please select a company first!");
      return;
    }

    stopRef.current = false;

    const totalUsers = users.length;

    let totalChecked = 0;
    let totalAlloted = 0;
    let totalVerified = 0;
    let totalUnverified = 0;
    let totalRejected = 0;
    let totalNotAlloted = 0;

    const getCompanyName = (companyId) => {
      const company = applicationReportList.find(
        (c) =>
          c.companyShareId?.toString() ===
          companyId?.toString()
      );

      return company
        ? company.companyName
        : "Unknown Company";
    };

    setCompanyName(getCompanyName(selectedCompanyId));

    setSummary({
      total: totalUsers,
      checked: 0,
      verified: 0,
      unverified: 0,
      rejected: 0,
      alloted: 0,
      notAlloted: 0,
    });

    setSellData([]);
    setFinalresult([]);
    setIsRunning(true);

    /* =======================================================
       HISTORY ONLY FOR CHECK STATUS
    ======================================================= */
    let verifiedUsers = [];

    if (checkMode === "checkStatus") {
      try {
        const res = await axios.get(
          `${API}/verifiedHistory/${selectedCompanyId}`
        );

        verifiedUsers = res.data || [];
      } catch (err) {
        console.log("Verified history error:", err);
        verifiedUsers = [];
      }
    }

    /* =======================================================
       LOOP USERS
    ======================================================= */
    for (let i = 0; i < users.length; i++) {
      if (stopRef.current) {
        stopRef.current = false;
        setIsRunning(false);
        return;
      }

      const {
        name,
        clientId,
        username,
        password,
        tms,
      } = users[i] || {};

      if (!clientId || !username || !password) {
        continue;
      }

      const clientKey = `${clientId}_${username}`;

      /* =====================================================
         HISTORY CHECK
      ===================================================== */
      if (
        checkMode === "checkStatus" &&
        verifiedUsers.includes(clientKey)
      ) {
        totalChecked++;
        totalVerified++;

        setFinalresult((prev) => [
          ...prev,
          {
            name,
            statusName: "Already Verified (History)",
            allotedKitta: 0,
          },
        ]);

        setSummary({
          total: totalUsers,
          checked: totalChecked,
          verified: totalVerified,
          unverified: totalUnverified,
          rejected: totalRejected,
          alloted: totalAlloted,
          notAlloted: totalNotAlloted,
        });

        continue;
      }

      /* =====================================================
         DELAY
      ===================================================== */
      for (let j = 0; j < 30; j++) {
        if (stopRef.current) {
          stopRef.current = false;
          setIsRunning(false);
          return;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 200)
        );
      }

      try {
        /* ===================================================
           LOGIN
        =================================================== */
        const res1 = await axios.post(
          "https://webbackend.cdsc.com.np/api/meroShare/auth/",
          {
            clientId,
            username,
            password,
          }
        );

        totalChecked++;

        if (
          res1.status === 200 &&
          res1.data.message === "Log in successful."
        ) {
          const savedToken =
            res1.headers["authorization"];

          localStorage.setItem(
            "savedToken",
            savedToken
          );

          if (stopRef.current) {
            stopRef.current = false;
            setIsRunning(false);
            return;
          }

          /* ================================================
             APPLICATION LIST
          ================================================= */
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

          const filteredReport = (
            res2.data.object || []
          ).filter(
            (app) =>
              app.companyShareId?.toString() ===
              selectedCompanyId?.toString()
          );

          /* ================================================
             APPLICATION FOUND
          ================================================= */
          if (filteredReport.length === 1) {
            const applicantFormId =
              filteredReport[0].applicantFormId;

            if (stopRef.current) {
              stopRef.current = false;
              setIsRunning(false);
              return;
            }

            const res3 = await axios.get(
              `https://webbackend.cdsc.com.np/api/meroShare/applicantForm/report/detail/${applicantFormId}`,
              {
                headers: {
                  authorization: savedToken,
                  "Content-Type": "application/json",
                },
              }
            );

            const statusName =
              res3.data.statusName || "Not Alloted";

            const allotedKitta =
              res3.data.receivedKitta || 0;

            const stageName =
              res3.data.stageName || "";

            /* ==============================================
               ALLOTMENT RESULT
            ============================================== */
            const allotmentStage =
              stageName === "SHARED_RESULT_UPLOADED" ||
              stageName ===
                "ALLOTMENT_RESULT_APPROVED" ||
              stageName === "SHARE_RESULT_DUMPED";

            if (allotmentStage) {
              if (statusName === "Alloted") {
                totalAlloted++;

                setSellData((prev) => [
                  ...prev,
                  {
                    name,
                    username,
                    tms,
                  },
                ]);
              } else {
                totalNotAlloted++;
              }

              setFinalresult((prev) => [
                ...prev,
                {
                  name,
                  statusName,
                  allotedKitta,
                },
              ]);

              setSummary({
                total: totalUsers,
                checked: totalChecked,
                verified: 0,
                unverified: 0,
                rejected: 0,
                alloted: totalAlloted,
                notAlloted: totalNotAlloted,
              });

              continue;
            }

            /* ==============================================
               CHECK STATUS
            ============================================== */
            if (checkMode === "checkStatus") {
              if (
                statusName === "Verified" ||
                statusName === "Unverified" ||
                statusName === "Rejected"
              ) {
                if (statusName === "Verified") {
                  totalVerified++;

                  await saveVerifiedUsers(
                    selectedCompanyId,
                    clientId,
                    username
                  );
                }

                if (statusName === "Unverified") {
                  totalUnverified++;
                }

                if (statusName === "Rejected") {
                  totalRejected++;
                }

                setFinalresult((prev) => [
                  ...prev,
                  {
                    name,
                    statusName,
                    allotedKitta,
                  },
                ]);

                setSummary({
                  total: totalUsers,
                  checked: totalChecked,
                  verified: totalVerified,
                  unverified: totalUnverified,
                  rejected: totalRejected,
                  alloted: 0,
                  notAlloted: 0,
                });

                continue;
              }
            }

            /* ==============================================
               CHECK RESULT
            ============================================== */
            if (checkMode === "checkResult") {
              setFinalresult((prev) => [
                ...prev,
                {
                  name,
                  statusName: "Result Not Available",
                  allotedKitta: 0,
                },
              ]);

              setSummary({
                total: totalUsers,
                checked: totalChecked,
                verified: 0,
                unverified: 0,
                rejected: 0,
                alloted: totalAlloted,
                notAlloted: totalNotAlloted,
              });

              continue;
            }
          } else {
            setFinalresult((prev) => [
              ...prev,
              {
                name,
                statusName:
                  checkMode === "checkResult"
                    ? "Result Not Available"
                    : "Not Applied",
                allotedKitta: 0,
              },
            ]);

            if (checkMode === "checkStatus") {
              setSummary({
                total: totalUsers,
                checked: totalChecked,
                verified: totalVerified,
                unverified: totalUnverified,
                rejected: totalRejected,
                alloted: 0,
                notAlloted: 0,
              });
            } else {
              setSummary({
                total: totalUsers,
                checked: totalChecked,
                verified: 0,
                unverified: 0,
                rejected: 0,
                alloted: totalAlloted,
                notAlloted: totalNotAlloted,
              });
            }
          }
        } else {
          setFinalresult((prev) => [
            ...prev,
            {
              name,
              statusName:
                res1?.data?.message ||
                "Login Failed",
              allotedKitta: 0,
            },
          ]);
        }
      } catch (err) {
        console.log("User error:", err);

        setFinalresult((prev) => [
          ...prev,
          {
            name,
            statusName:
              err.response?.data?.message ||
              "Error",
            allotedKitta: 0,
          },
        ]);
      }
    }

    setIsRunning(false);
  };

  /* =========================================================
     STATUS COLOR
  ========================================================= */
  const getStatusColor = (status) => {
    if (!status) {
      return "bg-gray-50 text-gray-800 border-gray-200";
    }

    const normalized = status.toLowerCase();

    if (normalized.includes("already verified")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (normalized.includes("not applied")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (normalized.includes("unverified")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (
      normalized.includes("not alloted") ||
      normalized.includes("rejected")
    ) {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (normalized.includes("verified")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (normalized.includes("alloted")) {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (normalized.includes("result not available")) {
      return "bg-orange-50 text-orange-700 border-orange-200";
    }

    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  /* =========================================================
     DOWNLOAD
  ========================================================= */
  const downloadSellData = () => {
    if (sellData.length === 0) return;

    let content = companyName + "\n";

    sellData.forEach((user, i) => {
      content += `${i + 1}. ${user.name}\t${user.username}\t${user.tms}\n`;
    });

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "sell_data.txt";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  };

  /* =========================================================
     SUMMARY
  ========================================================= */
  const statusSummary = [
    {
      label: "Total Investors",
      value: summary.total,
      icon: "👥",
      className:
        "border-slate-200 bg-slate-50 text-slate-800",
    },
    {
      label: "Checked",
      value: summary.checked,
      icon: "✓",
      className:
        "border-blue-200 bg-blue-50 text-blue-700",
    },
    {
      label: "Verified",
      value: summary.verified,
      icon: "✓",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    {
      label: "Unverified",
      value: summary.unverified,
      icon: "!",
      className:
        "border-amber-200 bg-amber-50 text-amber-700",
    },
    {
      label: "Rejected",
      value: summary.rejected,
      icon: "×",
      className:
        "border-red-200 bg-red-50 text-red-700",
    },
  ];

  const resultSummary = [
    {
      label: "Total Investors",
      value: summary.total,
      icon: "👥",
      className:
        "border-slate-200 bg-slate-50 text-slate-800",
    },
    {
      label: "Alloted",
      value: summary.alloted,
      icon: "🎉",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    {
      label: "Not Alloted",
      value: summary.notAlloted,
      icon: "−",
      className:
        "border-red-200 bg-red-50 text-red-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-800">

      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

          <button
            onClick={() => navigate("/home")}
            className="group flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-sm font-black text-white shadow-lg shadow-indigo-200">
              ₹
            </div>

            <div className="text-left">
              <p className="text-sm font-bold leading-tight text-slate-900 sm:text-base">
                IPO Dashboard
              </p>

              <p className="hidden text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:block">
                Investor Management
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/home")}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:px-4"
            >
              Home
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/", { replace: true });
              }}
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 sm:px-4"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          PAGE
      ===================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

        {/* ===================================================
            HERO
        =================================================== */}
        <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 px-5 py-7 text-white shadow-xl shadow-indigo-100 sm:mb-8 sm:px-8 sm:py-10">

          {/* Decorative circles */}
          <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-blue-500/20 blur-2xl" />
          <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-indigo-400/10 blur-2xl" />

          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Investment Tracking
            </div>

            <h1 className="max-w-2xl text-2xl font-black tracking-tight sm:text-4xl">
              Monitor Your IPO Investments
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
              Track application verification and allotment
              results across all your investors from one
              powerful dashboard.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-200">
                  Investors
                </p>
                <p className="mt-0.5 text-lg font-bold">
                  {users.length}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-200">
                  Mode
                </p>
                <p className="mt-0.5 text-sm font-bold">
                  {checkMode === "checkStatus"
                    ? "Status Check"
                    : "Result Check"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            MODE SELECTION
        =================================================== */}
        <section className="mb-6">

          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Choose Action
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                What would you like to check?
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* STATUS */}
            <button
              type="button"
              disabled={isRunning}
              onClick={() => {
                if (isRunning) return;

                setCheckMode("checkStatus");
                setFinalresult([]);
                setSellData([]);

                setSummary({
                  total: users.length,
                  checked: 0,
                  verified: 0,
                  unverified: 0,
                  rejected: 0,
                  alloted: 0,
                  notAlloted: 0,
                });
              }}
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition duration-200 sm:p-6 ${
                checkMode === "checkStatus"
                  ? "border-indigo-500 bg-white shadow-lg shadow-indigo-100"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              }`}
            >
              {checkMode === "checkStatus" && (
                <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-indigo-50" />
              )}

              <div className="relative flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${
                    checkMode === "checkStatus"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  ✓
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">
                      Check Status
                    </h3>

                    {checkMode === "checkStatus" && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-indigo-600">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    View verified, unverified and rejected
                    applications.
                  </p>
                </div>
              </div>
            </button>

            {/* RESULT */}
            <button
              type="button"
              disabled={isRunning}
              onClick={() => {
                if (isRunning) return;

                setCheckMode("checkResult");
                setFinalresult([]);
                setSellData([]);

                setSummary({
                  total: users.length,
                  checked: 0,
                  verified: 0,
                  unverified: 0,
                  rejected: 0,
                  alloted: 0,
                  notAlloted: 0,
                });
              }}
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition duration-200 sm:p-6 ${
                checkMode === "checkResult"
                  ? "border-emerald-500 bg-white shadow-lg shadow-emerald-100"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
              }`}
            >
              {checkMode === "checkResult" && (
                <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-emerald-50" />
              )}

              <div className="relative flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${
                    checkMode === "checkResult"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  ★
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">
                      Check Result
                    </h3>

                    {checkMode === "checkResult" && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-600">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    Check IPO allotment and identify successful
                    investors.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* ===================================================
            COMPANY CONTROL
        =================================================== */}
        {users.length > 0 && (
          <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg">
                📊
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Select Investment
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Choose the IPO issue you want to analyze.
                </p>
              </div>
            </div>

            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              IPO Company
            </label>

            <select
              value={selectedCompanyId}
              onChange={handleCompanyChange}
              disabled={isRunning}
              className="mb-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                Select IPO Company
              </option>

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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <button
                onClick={handleButtonClick}
                disabled={isRunning}
                className={`rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition active:scale-[0.98] ${
                  isRunning
                    ? "cursor-not-allowed bg-slate-400 shadow-none"
                    : checkMode === "checkStatus"
                    ? "bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700"
                    : "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {isRunning ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Processing Investors...
                    </>
                  ) : (
                    <>
                      {checkMode === "checkStatus"
                        ? "✓ Check Application Status"
                        : "★ Check Allotment Result"}
                    </>
                  )}
                </span>
              </button>

              <button
                onClick={() => {
                  stopRef.current = true;
                }}
                disabled={!isRunning}
                className={`rounded-2xl py-4 text-sm font-bold transition active:scale-[0.98] ${
                  !isRunning
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100"
                }`}
              >
                Stop Checking
              </button>
            </div>
          </section>
        )}

        {/* ===================================================
            SUMMARY
        =================================================== */}
        {(summary.total > 0 ||
          finalResult.length > 0) && (
          <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Portfolio Overview
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  {checkMode === "checkStatus"
                    ? "Application Summary"
                    : "Allotment Summary"}
                </h2>

                {companyName && (
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {companyName}
                  </p>
                )}
              </div>

              {isRunning && (
                <div className="flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
                  Live Checking
                </div>
              )}
            </div>

            {/* STATUS SUMMARY */}
            {checkMode === "checkStatus" && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {statusSummary.map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-sm sm:p-5 ${
                      item.className
                    } ${
                      index === 0
                        ? "col-span-2 sm:col-span-1"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">
                        {item.icon}
                      </span>

                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">
                        KPI
                      </span>
                    </div>

                    <p className="mt-4 text-xs font-semibold opacity-70">
                      {item.label}
                    </p>

                    <p className="mt-1 text-2xl font-black sm:text-3xl">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* RESULT SUMMARY */}
            {checkMode === "checkResult" && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {resultSummary.map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-sm sm:p-6 ${
                      item.className
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">
                        {item.icon}
                      </span>

                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">
                        KPI
                      </span>
                    </div>

                    <p className="mt-5 text-xs font-semibold opacity-70">
                      {item.label}
                    </p>

                    <p className="mt-1 text-3xl font-black">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* =================================================
                SUCCESS BANNER
            ================================================= */}
            {checkMode === "checkResult" &&
              summary.alloted > 0 && (
                <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xl text-white shadow-lg shadow-emerald-200">
                      ✓
                    </div>

                    <div>
                      <p className="font-bold text-emerald-900">
                        Successful Allotments
                      </p>

                      <p className="text-xs text-emerald-700">
                        {summary.alloted} investor
                        {summary.alloted !== 1
                          ? "s"
                          : ""} received IPO shares.
                      </p>
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white">
                    {summary.alloted} Alloted
                  </span>
                </div>
              )}

            {/* =================================================
                DOWNLOAD
            ================================================= */}
            {sellData.length > 0 && (
              <div className="mt-6 flex justify-center border-t border-slate-100 pt-6">

                <button
                  onClick={downloadSellData}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-indigo-600 active:scale-[0.98] sm:w-auto sm:min-w-[280px]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-base">
                    ↓
                  </span>

                  <span>
                    Download Sell Data
                    <span className="ml-1 text-xs font-medium text-slate-400 group-hover:text-indigo-100">
                      ({sellData.length})
                    </span>
                  </span>
                </button>
              </div>
            )}

            {/* =================================================
                RESULTS
            ================================================= */}
            {finalResult.length > 0 && (
              <div className="mt-7 border-t border-slate-100 pt-6">

                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Investor Activity
                    </p>

                    <h3 className="mt-1 text-lg font-black text-slate-900">
                      Individual Results
                    </h3>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                    {finalResult.length} / {users.length}
                  </span>
                </div>

                <ul className="space-y-3">
                  {finalResult.map((user, index) => {
                    const statusClass = getStatusColor(
                      user.statusName
                    );

                    const isAlloted =
                      user.statusName === "Alloted";

                    return (
                      <li
                        key={index}
                        className={`rounded-2xl border p-4 transition hover:shadow-md sm:p-5 ${statusClass}`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                          {/* LEFT */}
                          <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-sm font-black shadow-sm">
                              {index + 1}
                            </div>

                            <div className="min-w-0">
                              <p className="break-words text-sm font-bold sm:text-base">
                                {user.name}
                              </p>

                              {isAlloted &&
                                Number(
                                  user.allotedKitta
                                ) > 0 && (
                                  <p className="mt-1 text-xs font-semibold opacity-80">
                                    IPO shares successfully
                                    allotted
                                  </p>
                                )}
                            </div>
                          </div>

                          {/* RIGHT */}
                          <div className="flex items-center justify-between gap-3 border-t border-current/10 pt-3 sm:border-0 sm:pt-0">

                            {isAlloted &&
                              Number(
                                user.allotedKitta
                              ) > 0 && (
                                <div className="text-left sm:text-right">
                                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                                    Shares
                                  </p>

                                  <p className="text-lg font-black">
                                    {user.allotedKitta}
                                  </p>
                                </div>
                              )}

                            <span className="rounded-xl bg-white/80 px-3 py-2 text-xs font-black shadow-sm sm:text-sm">
                              {user.statusName}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* EMPTY STATE */}
            {!isRunning &&
              finalResult.length === 0 &&
              summary.total > 0 && (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                    📈
                  </div>

                  <p className="mt-3 font-bold text-slate-700">
                    Ready to analyze
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Select an IPO and start checking your
                    investors.
                  </p>
                </div>
              )}
          </section>
        )}

        {/* ===================================================
            FOOTER NOTE
        =================================================== */}
        <div className="pb-4 text-center">
          <p className="text-[11px] font-medium text-slate-400">
            IPO Dashboard • Investment tracking made simple
          </p>
        </div>
      </main>
    </div>
  );
}

export default CheckStatus;

