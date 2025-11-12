import axios from 'axios';
import { useState, useEffect } from 'react';
import Select from 'react-select';
// import { useNavigate } from "react-router-dom";

function Login() {
    const [dpName, setDpName] = useState([]);
    const [id, setId] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userLoginData, setUserLoginData] = useState({});
    const [applicationReport, setApplicationReport] = useState([]);
    // const navigate = useNavigate();

    const payload = { "filterFieldParams": [{ "key": "companyShare.companyIssue.companyISIN.script", "alias": "Scrip" }, { "key": "companyShare.companyIssue.companyISIN.company.name", "alias": "Company Name" }], "page": 1, "size": 200, "searchRoleViewConstants": "VIEW_APPLICANT_FORM_COMPLETE", "filterDateParams": [{ "key": "appliedDate", "condition": "", "alias": "", "value": "" }, { "key": "appliedDate", "condition": "", "alias": "", "value": "" }] }

    useEffect(() => {
        async function fetchData() {
            console.log("hh")
            try {
                await axios.get("https://webbackend.cdsc.com.np/api/meroShare/capital/").then((res) => {
                    setDpName(res.data);
                    console.log(res.data)
                })
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [])



    const onSubmitForm = (e) => {
        e.preventDefault();
        console.log('hello')
        console.log(id, username, password)
        async function login() {
            try {
                await axios.post("https://webbackend.cdsc.com.np/api/meroShare/auth/", { clientId: id, username, password })
                    .then((res) => {
                        if (res.status === 200) {
                            setUserLoginData(res.data);
                            if (res.data.message === "Log in successful.") {
                                console.log("Ready to Navigate")
                                // navigate("/currentIpo");
                            }
                            else {
                                alert(res.data.message);
                            }

                            const savedToken = res.headers["authorization"]
                            localStorage.setItem("savedToken", savedToken);
                        }
                    })
            } catch (err) {
                console.log(err);
            }
        }
        login();
    }

    const showApplicationReport = () => {
        async function fetchApplicationReport() {
            try {
                await axios.post("https://webbackend.cdsc.com.np/api/meroShare/applicantForm/active/search/", payload, {
                    headers: {
                        "authorization": `${localStorage.getItem("savedToken")}`,
                        "Content-Type": "application/json"
                    }
                }).then((res) => {
                    console.log(res.data.object);
                    setApplicationReport(res.data.object);
                })
            } catch (err) {
                console.log(err);
            }
        }
        fetchApplicationReport();
    }




    return (
        <div className="App">
            <h1>Welcome to My React App</h1>
            <div>This is a simple React application.</div>
            <div>
                {Object.entries(userLoginData).map(([key, value]) => (
                    <p key={key}>
                        <b>{key}</b>: {String(value)}
                    </p>
                ))}
            </div>
            <div className="flex items-center justify-center bg-gray-100" >
                <form onSubmit={onSubmitForm} className="w-120">
                    <div >
                        <Select
                            options={dpName.map(dpName => ({ value: dpName.id, label: dpName.name }))}
                            isSearchable
                            placeholder="Select Dp Name"
                            value={dpName.find(option => option.value === id)}
                            onChange={(selectedOption) => setId(selectedOption.value)}
                        />
                    </div>
                    <div>
                        <input type="text" placeholder="Client Id " onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <input type="password" placeholder="Password " onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" >Login</button>
                </form>
            </div>
            <div>

                <div className='m-20 bg-orange-300'>
                </div>
                <div>
                    Report of Applid IPO  <br /> 
                    <button onClick={showApplicationReport}> Show Application Report</button>
                </div>
                <div>
                    {applicationReport.map((app) => (
  <div key={app.applicantFormId} className="border p-3 mb-2 rounded shadow">
    <h2 className="font-semibold text-lg">{app.companyName}</h2>
    <p>Scrip: {app.scrip}</p>
    <p>Share Type: {app.shareTypeName}</p>
    <p>Status: 
      <span
        className={
          app.statusName === "TRANSACTION_SUCCESS"
            ? "text-green-600"
            : app.statusName === "BLOCKED_APPROVE"
            ? "text-yellow-600"
            : "text-red-600"
        }
      >
        {" "}{app.statusName}
      </span>
    </p>
    <p>Form ID: {app.applicantFormId}</p>
  </div>
))}

                        
                </div>
            </div>

        </div>
    );
}



export default Login