import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";




function ApplyIpo() {
  const backendBaseLink=process.env.REACT_APP_BACKEND_BASE_LINK;
  const stopRef = useRef(false);
  const mountedRef = useRef(true);
  const navigate = useNavigate();

  // STATE
  const [users, setUsers] = useState([]);
  const [currentOpening, setCurrentOpening] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [applyKitta, setApplyKitta] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ total:0, AppliedNow:0, AlreadyApplied:0,  });


  const token = localStorage.getItem("token");

  //Saving Applied Users function
  const saveAppliedUsers = async (companyId, clientId, username ) => {
    // Record applied IPO in backend
        try {await axios.post(`${backendBaseLink}/applyHistory/insertRecordofAppliedIpo`,
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




  // 🔴 CLEANUP ON UNMOUNT
  useEffect(() => {
    return () => {
      stopRef.current = true;
      mountedRef.current = false;
    };
  }, [backendBaseLink]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log(backendBaseLink)
        const res = await axios.get(`${backendBaseLink}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!mountedRef.current) return;
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
  }, [ token,navigate, backendBaseLink]);

  // Login function for first user
  const login = useCallback(async () => {
    const res = await axios.post(
      "https://webbackend.cdsc.com.np/api/meroShare/auth/",
      {
        clientId: users[0].clientId,
        username: users[0].username,
        password: users[0].password,
      }
    );
    return res.headers["authorization"];
  }, [users]);

  // Fetch current IPO opening
  useEffect(() => {
    if (users.length === 0) return;

    const fetchOpening = async () => {
      try {
        const savedToken = await login();
        const payload = {
          filterFieldParams: [
            { key: "companyIssue.companyISIN.script", alias: "Scrip" },
            { key: "companyIssue.companyISIN.company.name", alias: "Company Name" },
            { key: "companyIssue.assignedToClient.name", alias: "Issue Manager", value: "" }
          ],
          page: 1,
          size: 10,
          searchRoleViewConstants: "VIEW_APPLICABLE_SHARE",
          filterDateParams: [
            { key: "minIssueOpenDate", value: "" },
            { key: "maxIssueCloseDate", value: "" }
          ]
        };

        const res = await axios.post(
          "https://webbackend.cdsc.com.np/api/meroShare/companyShare/applicableIssue/",
          payload,
          { headers: { authorization: savedToken } }
        );

        if (!mountedRef.current) return;
        setCurrentOpening(res.data.object);
      } catch (err) {
        console.log("Error fetching openings:", err.message);
      }
    };

    fetchOpening();
  }, [users, login]);

  // Apply IPO for each user
  const handleApplyButton = async () => {
    stopRef.current = false;

    if (!selectedCompanyId) return alert("Select Company First");
    if (!(applyKitta > 0 && applyKitta % 10 === 0))
      return alert("Applied Kitta must be multiple of 10");

    setResults([]);
    setLoading(true);


    const res = await axios.get(
      `${backendBaseLink}/applyHistory/${selectedCompanyId}`
    );
    const appliedUsers = res.data;
    console.log(res.data)
    console.log(typeof(appliedUsers))
    console.log(Array.isArray(appliedUsers))
    

    for (let i = 0; i < users.length; i++) {
      if (stopRef.current) break;

      const user = users[i];
      const name = user.name;
      const crnNumber = user.crn;
      const transactionPIN = user.pin;
      

      //Check if already applied
      const clientKey = `${user.clientId}_${user.username}`;
      if (appliedUsers.includes(clientKey)) {
        await new Promise(r => setTimeout(r, 300));
        if (mountedRef.current) setResults(prev => [...prev, { name, status: "success", message: "Already Applied (History)" }]);
        continue;
      }


      // Delay 8 sec for each user
      for (let t = 0; t < 10; t++) {
        if (stopRef.current) break;
        await new Promise(r => setTimeout(r, 1000));
      }

      if (stopRef.current) break;

      try {
        const loginRes = await axios.post(
          "https://webbackend.cdsc.com.np/api/meroShare/auth/",
          {
            clientId: user.clientId,
            username: user.username,
            password: user.password,
          }
        );
        if (!mountedRef.current) return;
        
        if(loginRes.data.accountExpired===true|| loginRes.data.changePassword===true ||loginRes.data.dematExpired===true || loginRes.data.isTransactionPINNotSetBefore===true || loginRes.data.isTransactionPINReset===true ||loginRes.data.passwordExpired===true)
          {
            setResults(prev => [...prev, { name, status: "error", message: loginRes.data.message }]);
            continue;
        }

        const savedToken = loginRes.headers["authorization"];


        // Fetch own detail
        const detailRes = await axios.get(
          "https://webbackend.cdsc.com.np/api/meroShare/ownDetail/",
          { headers: { authorization: savedToken } }
        );
        const dematNumber = detailRes.data?.demat;

        const payload1 = {
          filterFieldParams: [
            { key: "companyIssue.companyISIN.script", alias: "Scrip" },
            { key: "companyIssue.companyISIN.company.name", alias: "Company Name" },
            { key: "companyIssue.assignedToClient.name", alias: "Issue Manager", value: "" }
          ],
          page: 1,
          size: 10,
          searchRoleViewConstants: "VIEW_APPLICABLE_SHARE",
          filterDateParams: [
            { key: "minIssueOpenDate", value: "" },
            { key: "maxIssueCloseDate", value: "" }
          ]
        };

        const applicableIssueListRes = await axios.post(
          "https://webbackend.cdsc.com.np/api/meroShare/companyShare/applicableIssue/",
          payload1,
          { headers: { authorization: savedToken } }
        );

        const applicableCompanyDetail = applicableIssueListRes.data.object.find(item => item.companyShareId === Number(selectedCompanyId));

        if ("action" in applicableCompanyDetail) {
          if (applicableCompanyDetail.action === "inProcess" || applicableCompanyDetail.action === "edit") {
            if (mountedRef.current) setResults(prev => [...prev, { name, status: "success", message: "Already Applied" }]);
          }

          if (applicableCompanyDetail.action === "reapply") {
            if (mountedRef.current) setResults(prev => [...prev, { name, status: "error", message: "Reapply" }]);
          }
          await saveAppliedUsers(selectedCompanyId, user.clientId, user.username);
          continue
        }

        // Fetch bank info
        const bankRes = await axios.get(
          "https://webbackend.cdsc.com.np/api/meroShare/bank/",
          { headers: { authorization: savedToken } }
        );
        let selectedBankId = bankRes.data[0]?.id;
        if (bankRes.data.length === 2) {
          selectedBankId = bankRes.data[1]?.id;
        }

        // Check applicability
        const applicableRes = await axios.get(
          `https://webbackend.cdsc.com.np/api/meroShare/applicantForm/customerType/${selectedCompanyId}/${dematNumber}`,
          { headers: { authorization: savedToken } }
        );
        if (applicableRes.data.message !== "Customer can apply.") {
          if (mountedRef.current) setResults(prev => [...prev, { name, status: "error", message: applicableRes.data.message }]);
          continue;
        }

        // Fetch bank details
        const bankDetailRes = await axios.get(
          `https://webbackend.cdsc.com.np/api/meroShare/bank/${selectedBankId}`,
          { headers: { authorization: savedToken } }
        );
        const bd = bankDetailRes.data[0];

        // Final payload
        const payload = {
          accountBranchId: bd?.accountBranchId,
          accountNumber: bd?.accountNumber,
          accountTypeId: bd?.accountTypeId,
          appliedKitta: applyKitta,
          bankId: String(selectedBankId),
          boid: String(dematNumber).slice(-8),
          companyShareId: selectedCompanyId,
          crnNumber,
          customerId: bd?.id,
          demat: dematNumber,
          transactionPIN,
        };


        // Submit IPO
        const submitRes = await axios.post(
          "https://webbackend.cdsc.com.np/api/meroShare/applicantForm/share/apply",
          payload,
          { headers: { authorization: savedToken, "Content-Type": "application/json" } }
        );

        if (mountedRef.current) {
          setResults(prev => [...prev, { name, status: submitRes.status === 201 ? "success" : "error", message: submitRes.data.message || "Something went wrong" }]);
        }

        // Record applied IPO in backend
        await saveAppliedUsers(selectedCompanyId, user.clientId, user.username);



      } catch (err) {
        if (!mountedRef.current) return;
        setResults(prev => [...prev, { name, status: "error", message: err.response?.data?.message || err.message }]);
      }

      if (stopRef.current) break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (mountedRef.current) setLoading(false);
  };


  const handleChangeOfSelectedCompany = async (e) => {
    const selectedValue = e.target.value;
    setSelectedCompanyId(selectedValue);

    if (!selectedValue) return;

  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 onClick={() => { stopRef.current = true; navigate("/home"); }} className="text-xl font-bold text-blue-600 cursor-pointer hover:opacity-80">
            IPO Dashboard
          </h1>
          <div className="flex gap-3">
            <button onClick={() => { stopRef.current = true; navigate("/home"); }} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition">Home</button>
            <button onClick={() => { stopRef.current = true; localStorage.removeItem("token"); navigate("/", { replace: true }); }} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition">Logout</button>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800">Apply IPO</h2>
          <p className="text-gray-500 mt-2">Apply IPO for all registered users in one click</p>
        </div>

        {users.length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* FORM */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Company</label>
                <select value={selectedCompanyId} onChange={handleChangeOfSelectedCompany} className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="">-- Select Company --</option>
                  {currentOpening.map(c => (<option key={c.companyShareId} value={c.companyShareId}>{c.companyName} ({c.scrip})</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Kitta</label>
                <input value={applyKitta} onChange={e => setApplyKitta(e.target.value)} placeholder="10, 20, 30..." className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              <button onClick={handleApplyButton} disabled={loading} className={`flex-1 py-4 rounded-xl text-white font-bold text-lg transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"}`}>
                {loading ? "Applying IPO..." : "Apply IPO"}
              </button>
              {loading && <button onClick={() => { stopRef.current = true; setLoading(false); }} className="px-6 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg transition">STOP</button>}
            </div>

            {/* RESULTS */}
            {results.length > 0 && (
              <div className="mt-10 space-y-4">
                {results.map((r, index) => (
                  <div key={index} className={`flex items-center justify-between px-6 py-4 rounded-xl shadow-md text-white ${r.status === "success" ? "bg-green-600" : "bg-red-600"}`}>
                    <span className="font-semibold">{r.name}</span>
                    <span className="text-sm opacity-90">{r.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default ApplyIpo;
