




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function ApplyIpo() {
  const navigate = useNavigate();
  
  

  // STATE
   const [users, setUsers] = useState([]);
  const [currentOpening, setCurrentOpening] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [applyKitta, setApplyKitta] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applyStatus, setApplyStatus] = useState(""); // "success" | "error"


  const [accountBranchId, setAccountBranchId] = useState();
  const [accountNumber, setAccountNumber] = useState();
  const [accountTypeId, setAccountTypeId] = useState();
  const [bankId, setBankId] = useState("");
  const [boid, setBoid] = useState();
  const [companyShareId, setCompanyShareId] = useState();
  const [customerId, setCustomerId] = useState();
  const [demat, setDemat] = useState();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
        console.log(res.data.length)
        if(res.data.length === 0){
          alert("No users found. Please add users first.");
          navigate("/users");
        }
      } catch {
        navigate("/");
      }
    };
    fetchUsers();
  }, [navigate, token]);

  // ------------------------
  // LOGIN FUNCTION
  // ------------------------
  



  const login = async () => {
    
    const res = await axios.post(
      "https://webbackend.cdsc.com.np/api/meroShare/auth/",
      {
        clientId: users[0].clientId,
        username: users[0].username,
        password: users[0].password,
      }
    );
    return res.headers["authorization"];
  };

  // ------------------------
  // FETCH CURRENT OPENING
  // ------------------------
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

        setCurrentOpening(res.data.object);
      } catch (err) {
        console.log("Error fetching openings:", err.message);
      }
    };

    fetchOpening();
  }, [users]);

  // ------------------------
  // HANDLE APPLY IPO
  // ------------------------
  const handleApplyButton = async () => {
    for(let i=0;i<users.length;i++){
      const user = users[i];
      const name = user.name;
      const crnNumber = user.crn;
      const transactionPIN = user.pin;
      
      await new Promise((resolve) => setTimeout(resolve, 1000)); // reduce delay for demo
      
    



    if (!selectedCompanyId) return alert("Select Company First");
    if (!(applyKitta > 0 && applyKitta % 10 === 0))
      return alert("Applied Kitta must be multiple of 10");

    setShowDetail(true);

    try {
      const loginRes = await axios.post(
        "https://webbackend.cdsc.com.np/api/meroShare/auth/",
        {
          clientId: users[i].clientId,
          username: users[i].username,
          password: users[i].password,
        }
      );
      if (loginRes.status !== 200) {
        return console.log(loginRes.data.message);
      }

      const savedToken = loginRes.headers["authorization"];

      // Fetch own detail
      const detailRes = await axios.get(
        "https://webbackend.cdsc.com.np/api/meroShare/ownDetail/",
        { headers: { authorization: savedToken } }
      );
      const dematNumber = detailRes.data?.demat;
      setDemat(dematNumber);

      if (dematNumber) setBoid(String(dematNumber).slice(-8));



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


      // Fetch bank info
      const bankRes = await axios.get(
        "https://webbackend.cdsc.com.np/api/meroShare/bank/",
        { headers: { authorization: savedToken } }
      );

      const selectedBankId = bankRes.data[0]?.id;
      setBankId(selectedBankId);



      const applicableIssueListRes = await axios.post(
        "https://webbackend.cdsc.com.np/api/meroShare/companyShare/applicableIssue/",
        payload1,
        { headers: { authorization: savedToken } }
      );
      const applicableCompanyDetail = applicableIssueListRes.data.object.find(item => item.companyShareId === Number(selectedCompanyId))

      if ("action" in applicableCompanyDetail) {
        if (applicableCompanyDetail.action === "inProcess") {
          console.log("Already Applied")
          return
        }

        if(applicableCompanyDetail.action==="reapply"){
          console.log("Ready to reapply")
          return
        }
        console.log("non of above")
        return
      }


      // Check applicability
      const applicableRes = await axios.get(
        `https://webbackend.cdsc.com.np/api/meroShare/applicantForm/customerType/${selectedCompanyId}/${dematNumber}`,
        { headers: { authorization: savedToken } }
      );

      if (applicableRes.data.message !== "Customer can apply.") {
        setApplyMessage(applicableRes.data.message);
        setApplyStatus("error");
        return;
      }


      // Fetch bank details
      const bankDetailRes = await axios.get(
        `https://webbackend.cdsc.com.np/api/meroShare/bank/${selectedBankId}`,
        { headers: { authorization: savedToken } }
      );

      const bd = bankDetailRes.data[0];
      setAccountBranchId(bd?.accountBranchId);
      setAccountNumber(bd?.accountNumber);
      setAccountTypeId(bd?.accountTypeId);
      setCustomerId(bd?.id);

      setCompanyShareId(selectedCompanyId);

      // Final payload
      const payload = {
        accountBranchId: bd?.accountBranchId,
        accountNumber: bd?.accountNumber,
        accountTypeId: bd?.accountTypeId,
        appliedKitta: applyKitta,
        bankId: selectedBankId,
        boid: String(dematNumber).slice(-8),
        companyShareId: selectedCompanyId,
        crnNumber,
        customerId: bd?.id,
        demat: dematNumber,
        transactionPIN,
      };

      console.log(payload)

      // SUBMIT IPO
      
      const submitRes = await axios.post(
        "https://webbackend.cdsc.com.np/api/meroShare/applicantForm/share/apply",
        payload,
        { headers: { authorization: savedToken, "Content-Type": "application/json" } }
      );

      // 🟢 SUCCESS
      if (submitRes.status === 201) {
        setApplyMessage(`${name}: ${submitRes.data.message}`);
        setApplyStatus("success");
      } else {
        // 🔴 ERROR (unexpected)
        setApplyMessage(submitRes.data.message || "Something went wrong");
        setApplyStatus("error");
      }

    } catch (err) {
      // 🔴 CATCH ERROR
      setApplyMessage(err.response?.data?.message || err.message);
      setApplyStatus("error");
    }
  }
}


  // ------------------------
  // UI
  // ------------------------
  return (
    <div>
      <div>Apply IPO</div>

      {users.length > 0 && (
        <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg mb-8">
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
          >
            <option value="">Select Company</option>
            {currentOpening.map(c => (
              <option key={c.companyShareId} value={c.companyShareId}>
                {c.companyName} ({c.scrip})
              </option>
            ))}
          </select>

          <div>
            Total Kitta:
            <input
              value={applyKitta}
              onChange={e => setApplyKitta(e.target.value)}
              className="border ml-2 p-2 rounded"
            />
          </div>

          <button
            onClick={handleApplyButton}
            className="w-full bg-blue-600 text-white mt-4 py-3 rounded-lg"
          >
            Apply IPO
          </button>

          
          {applyMessage && (
            <div
              className={`mt-4 p-4 rounded-lg text-white font-semibold ${applyStatus === "success" ? "bg-green-600" : "bg-red-600"
                }`}
            >
              {applyMessage}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default ApplyIpo;
