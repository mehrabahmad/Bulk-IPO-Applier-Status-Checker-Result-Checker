import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

function ApplyIpo() {
  const backendBaseLink =
    process.env.REACT_APP_BACKEND_BASE_LINK;

  const stopRef = useRef(false);
  const mountedRef = useRef(true);

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [currentOpening, setCurrentOpening] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] =
    useState("");
  const [applyKitta, setApplyKitta] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // =========================================================
  // SAVE APPLIED USERS
  // =========================================================
  const saveAppliedUsers = async (
    companyId,
    clientId,
    username
  ) => {
    try {
      await axios.post(
        `${backendBaseLink}/applyHistory/insertRecordofAppliedIpo`,
        {
          companyId,
          clientId,
          username,
        }
      );
    } catch (err) {
      alert("Something went wrong");
    }
  };

  // =========================================================
  // COMPONENT UNMOUNT
  // =========================================================
  useEffect(() => {
    return () => {
      stopRef.current = true;
      mountedRef.current = false;
    };
  }, [backendBaseLink]);

  // =========================================================
  // FETCH USERS
  // =========================================================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${backendBaseLink}/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!mountedRef.current) return;

        setUsers(res.data);

        if (res.data.length === 0) {
          alert(
            "No users found. Please add users first."
          );

          navigate("/users");
        }
      } catch (err) {
        navigate("/");
      }
    };

    fetchUsers();
  }, [
    token,
    navigate,
    backendBaseLink,
  ]);

  // =========================================================
  // LOGIN FIRST USER
  // =========================================================
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

  // =========================================================
  // FETCH CURRENT OPENING IPO
  // =========================================================
  useEffect(() => {
    if (users.length === 0) return;

    const fetchOpening = async () => {
      try {
        const savedToken = await login();

        const payload = {
          filterFieldParams: [
            {
              key: "companyIssue.companyISIN.script",
              alias: "Scrip",
            },
            {
              key: "companyIssue.companyISIN.company.name",
              alias: "Company Name",
            },
            {
              key: "companyIssue.assignedToClient.name",
              alias: "Issue Manager",
              value: "",
            },
          ],

          page: 1,
          size: 10,

          searchRoleViewConstants:
            "VIEW_APPLICABLE_SHARE",

          filterDateParams: [
            {
              key: "minIssueOpenDate",
              value: "",
            },
            {
              key: "maxIssueCloseDate",
              value: "",
            },
          ],
        };

        const res = await axios.post(
          "https://webbackend.cdsc.com.np/api/meroShare/companyShare/applicableIssue/",
          payload,
          {
            headers: {
              authorization: savedToken,
            },
          }
        );

        if (!mountedRef.current) return;

        setCurrentOpening(res.data.object);
      } catch (err) {
        console.log(
          "Error fetching openings:",
          err.message
        );
      }
    };

    fetchOpening();
  }, [users, login]);

  // =========================================================
  // APPLY IPO
  // =========================================================
  const handleApplyButton = async () => {
    stopRef.current = false;

    // -------------------------------------------------------
    // VALIDATE COMPANY
    // -------------------------------------------------------
    if (!selectedCompanyId) {
      return alert("Select Company First");
    }

    // -------------------------------------------------------
    // VALIDATE KITTA
    // -------------------------------------------------------
    if (
      !(applyKitta > 0 && applyKitta % 10 === 0)
    ) {
      return alert(
        "Applied Kitta must be multiple of 10"
      );
    }

    setResults([]);
    setLoading(true);

    try {
      // =====================================================
      // GET APPLICATION HISTORY
      // =====================================================
      const res = await axios.get(
        `${backendBaseLink}/applyHistory/${selectedCompanyId}`
      );

      const appliedUsers = res.data;

      console.log(
        "Applied users:",
        appliedUsers
      );

      console.log(
        "Type:",
        typeof appliedUsers
      );

      console.log(
        "Is Array:",
        Array.isArray(appliedUsers)
      );

      // =====================================================
      // PROCESS USERS ONE BY ONE
      // =====================================================
      for (
        let i = 0;
        i < users.length;
        i++
      ) {
        if (stopRef.current) break;

        const user = users[i];

        const name = user.name;
        const crnNumber = user.crn;
        const transactionPIN = user.pin;

        const clientKey = `${user.clientId}_${user.username}`;

        // ===================================================
        // ALREADY APPLIED IN OUR HISTORY
        // ===================================================
        if (appliedUsers.includes(clientKey)) {
          await new Promise((r) =>
            setTimeout(r, 300)
          );

          if (mountedRef.current) {
            setResults((prev) => [
              ...prev,
              {
                name,
                status: "success",
                message:
                  "Already Applied (History)",
              },
            ]);
          }

          continue;
        }

        // ===================================================
        // WAIT 10 SECONDS
        // ===================================================
        for (let t = 0; t < 10; t++) {
          if (stopRef.current) break;

          await new Promise((r) =>
            setTimeout(r, 1000)
          );
        }

        if (stopRef.current) break;

        try {
          // =================================================
          // LOGIN USER
          // =================================================
          const loginRes = await axios.post(
            "https://webbackend.cdsc.com.np/api/meroShare/auth/",
            {
              clientId: user.clientId,
              username: user.username,
              password: user.password,
            }
          );

          if (!mountedRef.current) return;

          // =================================================
          // ACCOUNT STATUS CHECK
          // =================================================
          if (
            loginRes.data.accountExpired ===
              true ||
            loginRes.data.changePassword ===
              true ||
            loginRes.data.dematExpired ===
              true ||
            loginRes.data
              .isTransactionPINNotSetBefore ===
              true ||
            loginRes.data
              .isTransactionPINReset === true ||
            loginRes.data.passwordExpired ===
              true
          ) {
            setResults((prev) => [
              ...prev,
              {
                name,
                status: "error",
                message:
                  loginRes.data.message ||
                  "Account cannot be used",
              },
            ]);

            continue;
          }

          const savedToken =
            loginRes.headers["authorization"];

          // =================================================
          // GET DEMAT DETAILS
          // =================================================
          const detailRes = await axios.get(
            "https://webbackend.cdsc.com.np/api/meroShare/ownDetail/",
            {
              headers: {
                authorization: savedToken,
              },
            }
          );

          const dematNumber =
            detailRes.data?.demat;

          // =================================================
          // GET APPLICABLE IPO LIST
          // =================================================
          const payload1 = {
            filterFieldParams: [
              {
                key: "companyIssue.companyISIN.script",
                alias: "Scrip",
              },
              {
                key: "companyIssue.companyISIN.company.name",
                alias: "Company Name",
              },
              {
                key: "companyIssue.assignedToClient.name",
                alias: "Issue Manager",
                value: "",
              },
            ],

            page: 1,
            size: 10,

            searchRoleViewConstants:
              "VIEW_APPLICABLE_SHARE",

            filterDateParams: [
              {
                key: "minIssueOpenDate",
                value: "",
              },
              {
                key: "maxIssueCloseDate",
                value: "",
              },
            ],
          };

          const applicableIssueListRes =
            await axios.post(
              "https://webbackend.cdsc.com.np/api/meroShare/companyShare/applicableIssue/",
              payload1,
              {
                headers: {
                  authorization: savedToken,
                },
              }
            );

          const applicableCompanyDetail =
            applicableIssueListRes.data.object?.find(
              (item) =>
                item.companyShareId ===
                Number(selectedCompanyId)
            );

          // =================================================
          // CHECK EXISTING APPLICATION
          // =================================================
          if (
            applicableCompanyDetail &&
            "action" in
              applicableCompanyDetail
          ) {
            // -----------------------------------------------
            // ALREADY APPLIED
            // -----------------------------------------------
            if (
              applicableCompanyDetail.action ===
                "inProcess" ||
              applicableCompanyDetail.action ===
                "edit"
            ) {
              if (mountedRef.current) {
                setResults((prev) => [
                  ...prev,
                  {
                    name,
                    status: "success",
                    message:
                      "Already Applied",
                  },
                ]);
              }
            }

            // -----------------------------------------------
            // REAPPLY
            // -----------------------------------------------
            if (
              applicableCompanyDetail.action ===
              "reapply"
            ) {
              if (mountedRef.current) {
                setResults((prev) => [
                  ...prev,
                  {
                    name,
                    status: "error",
                    message: "Reapply",
                  },
                ]);
              }
            }

            await saveAppliedUsers(
              selectedCompanyId,
              user.clientId,
              user.username
            );

            continue;
          }

          // =================================================
          // GET BANK LIST
          // =================================================
          const bankRes = await axios.get(
            "https://webbackend.cdsc.com.np/api/meroShare/bank/",
            {
              headers: {
                authorization: savedToken,
              },
            }
          );

          let selectedBankId =
            bankRes.data[0]?.id;

          if (bankRes.data.length === 2) {
            selectedBankId =
              bankRes.data[1]?.id;
          }

          // =================================================
          // CHECK CUSTOMER TYPE
          // =================================================
          const applicableRes =
            await axios.get(
              `https://webbackend.cdsc.com.np/api/meroShare/applicantForm/customerType/${selectedCompanyId}/${dematNumber}`,
              {
                headers: {
                  authorization: savedToken,
                },
              }
            );

          if (
            applicableRes.data.message !==
            "Customer can apply."
          ) {
            if (mountedRef.current) {
              setResults((prev) => [
                ...prev,
                {
                  name,
                  status: "error",
                  message:
                    applicableRes.data.message ||
                    "Customer cannot apply",
                },
              ]);
            }

            continue;
          }

          // =================================================
          // GET BANK DETAILS
          // =================================================
          const bankDetailRes =
            await axios.get(
              `https://webbackend.cdsc.com.np/api/meroShare/bank/${selectedBankId}`,
              {
                headers: {
                  authorization: savedToken,
                },
              }
            );

          const bd =
            bankDetailRes.data[0];

          // =================================================
          // APPLICATION PAYLOAD
          // =================================================
          const payload = {
            accountBranchId:
              bd?.accountBranchId,

            accountNumber:
              bd?.accountNumber,

            accountTypeId:
              bd?.accountTypeId,

            appliedKitta: applyKitta,

            bankId: String(
              selectedBankId
            ),

            boid: String(
              dematNumber
            ).slice(-8),

            companyShareId:
              selectedCompanyId,

            crnNumber,

            customerId: bd?.id,

            demat: dematNumber,

            transactionPIN,
          };

          // =================================================
          // SUBMIT APPLICATION
          // =================================================
          const submitRes =
            await axios.post(
              "https://webbackend.cdsc.com.np/api/meroShare/applicantForm/share/apply",
              payload,
              {
                headers: {
                  authorization: savedToken,
                  "Content-Type":
                    "application/json",
                },
              }
            );

          // =================================================
          // APPLICATION RESULT
          // =================================================
          if (mountedRef.current) {
            setResults((prev) => [
              ...prev,
              {
                name,

                status:
                  submitRes.status === 201
                    ? "success"
                    : "error",

                message:
                  submitRes.data.message ||
                  "Something went wrong",
              },
            ]);
          }

          // =================================================
          // SAVE APPLICATION HISTORY
          // =================================================
          await saveAppliedUsers(
            selectedCompanyId,
            user.clientId,
            user.username
          );
        } catch (err) {
          if (!mountedRef.current) return;

          setResults((prev) => [
            ...prev,
            {
              name,
              status: "error",
              message:
                err.response?.data?.message ||
                err.message ||
                "Something went wrong",
            },
          ]);
        }

        if (stopRef.current) break;

        await new Promise((resolve) =>
          setTimeout(resolve, 500)
        );
      }
    } catch (err) {
      if (mountedRef.current) {
        setResults((prev) => [
          ...prev,
          {
            name: "System",
            status: "error",
            message:
              err.response?.data?.message ||
              err.message ||
              "Something went wrong",
          },
        ]);
      }
    }

    if (mountedRef.current) {
      setLoading(false);
    }
  };

  // =========================================================
  // COMPANY CHANGE
  // =========================================================
  const handleChangeOfSelectedCompany = (
    e
  ) => {
    const selectedValue = e.target.value;

    setSelectedCompanyId(
      selectedValue
    );
  };

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      <Header />

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ===================================================
            PAGE TITLE
        ==================================================== */}
        <div className="mb-8">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                IPO APPLICATION
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Apply IPO
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Apply for the selected IPO across
                all your registered users from one
                place.
              </p>

            </div>

            {/* Registered Users */}
            <div className="flex items-center gap-3 rounded-2xl border border-white bg-white px-5 py-4 shadow-lg shadow-gray-200/50">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                👥
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">
                  Registered Users
                </p>

                <p className="text-xl font-bold text-gray-900">
                  {users.length}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* ===================================================
            USERS AVAILABLE
        ==================================================== */}
        {users.length > 0 && (
          <div className="space-y-6">

            {/* =================================================
                APPLICATION CARD
            ================================================== */}
            <div className="overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-gray-300/40">

              {/* Card Header */}
              <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 px-6 py-5 sm:px-8">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl text-white shadow-lg shadow-blue-500/20">
                    📈
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Application Details
                    </h3>

                    <p className="mt-0.5 text-sm text-gray-500">
                      Select an open IPO and enter the
                      number of shares.
                    </p>
                  </div>

                </div>

              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8">

                <div className="grid gap-6 md:grid-cols-2">

                  {/* COMPANY */}
                  <div>

                    <label className="mb-2.5 block text-sm font-semibold text-gray-700">
                      Select Company
                    </label>

                    <div className="relative">

                      <select
                        value={
                          selectedCompanyId
                        }
                        onChange={
                          handleChangeOfSelectedCompany
                        }
                        disabled={loading}
                        className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-10 text-sm font-medium text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="">
                          -- Select Company --
                        </option>

                        {currentOpening.map(
                          (c) => (
                            <option
                              key={
                                c.companyShareId
                              }
                              value={
                                c.companyShareId
                              }
                            >
                              {c.companyName} (
                              {c.scrip})
                            </option>
                          )
                        )}
                      </select>

                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        ▼
                      </div>

                    </div>

                  </div>

                  {/* KITTA */}
                  <div>

                    <label className="mb-2.5 block text-sm font-semibold text-gray-700">
                      Total Kitta
                    </label>

                    <input
                      type="number"
                      min="10"
                      step="10"
                      value={applyKitta}
                      onChange={(e) =>
                        setApplyKitta(
                          e.target.value
                        )
                      }
                      disabled={loading}
                      placeholder="10, 20, 30..."
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <p className="mt-2 text-xs text-gray-400">
                      Enter a quantity in
                      multiples of 10.
                    </p>

                  </div>

                </div>

                {/* Divider */}
                <div className="my-7 border-t border-gray-100"></div>

                {/* BUTTONS */}
                <div className="flex flex-col gap-3 sm:flex-row">

                  {/* APPLY */}
                  <button
                    onClick={
                      handleApplyButton
                    }
                    disabled={loading}
                    className={`group flex flex-1 items-center justify-center gap-3 rounded-2xl py-4 text-base font-bold text-white shadow-lg transition duration-200 ${
                      loading
                        ? "cursor-not-allowed bg-gray-400 shadow-none"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                    }`}
                  >
                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>

                        Applying IPO...
                      </>
                    ) : (
                      <>
                        <span className="text-lg">
                          🚀
                        </span>

                        Apply IPO
                      </>
                    )}
                  </button>

                  {/* STOP */}
                  {loading && (
                    <button
                      onClick={() => {
                        stopRef.current = true;
                        setLoading(false);
                      }}
                      className="rounded-2xl bg-red-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl"
                    >
                      ⛔ STOP
                    </button>
                  )}

                </div>

                {/* INFORMATION */}
                {!loading &&
                  results.length === 0 && (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl bg-gray-50 px-4 py-4 text-sm text-gray-500">

                      <span className="mt-0.5 text-base">
                        ℹ️
                      </span>

                      <p>
                        Select the company and enter
                        your desired Kitta before
                        starting the application
                        process.
                      </p>

                    </div>
                  )}

              </div>
            </div>

            {/* =================================================
                RESULTS
            ================================================== */}
            {results.length > 0 && (
              <div className="overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-gray-300/40">

                {/* RESULTS HEADER */}
                <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-lg">
                      📋
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900">
                        Application Results
                      </h3>

                      <p className="text-xs text-gray-500">
                        Status of each user
                        application
                      </p>
                    </div>

                  </div>

                  <div className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600">
                    {results.length} /{" "}
                    {users.length} Processed
                  </div>

                </div>

                {/* =================================================
                    RESULT LIST
                ================================================== */}
                <div className="space-y-3 p-5 sm:p-6">

                  {results.map(
                    (r, index) => {

                      // SUCCESS = GREEN
                      // EVERYTHING ELSE = DARK RED
                      const isSuccess =
                        r.status ===
                        "success";

                      return (
                        <div
                          key={index}
                          className={`flex flex-col gap-4 rounded-2xl border px-5 py-4 shadow-sm transition sm:flex-row sm:items-center sm:justify-between ${
                            isSuccess
                              ? "border-green-500 bg-green-100 hover:bg-green-200"
                              : "border-red-900 bg-red-800 hover:bg-red-900"
                          }`}
                        >

                          {/* USER INFORMATION */}
                          <div className="flex items-center gap-3">

                            {/* NUMBER */}
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                                isSuccess
                                  ? "bg-green-200 text-green-800"
                                  : "bg-red-950 text-white"
                              }`}
                            >
                              {index + 1}
                            </div>

                            {/* NAME */}
                            <div>

                              <p
                                className={`font-bold ${
                                  isSuccess
                                    ? "text-green-900"
                                    : "text-white"
                                }`}
                              >
                                {r.name}
                              </p>

                              <p
                                className={`text-xs font-medium ${
                                  isSuccess
                                    ? "text-green-700"
                                    : "text-red-200"
                                }`}
                              >
                                {isSuccess
                                  ? "Application successful"
                                  : "Application failed"}
                              </p>

                            </div>

                          </div>

                          {/* STATUS MESSAGE */}
                          <div
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${
                              isSuccess
                                ? "bg-green-200 text-green-800"
                                : "bg-red-950 text-white"
                            }`}
                          >

                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold ${
                                isSuccess
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              {isSuccess
                                ? "✓"
                                : "✕"}
                            </span>

                            {r.message}

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              </div>
            )}

          </div>
        )}

        {/* =====================================================
            NO USERS
        ====================================================== */}
        {users.length === 0 && (
          <div className="rounded-3xl border border-white bg-white p-12 text-center shadow-xl">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
              👥
            </div>

            <h3 className="mt-5 text-lg font-bold text-gray-900">
              No Users Found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Please add users before applying for
              an IPO.
            </p>

            <button
              onClick={() =>
                navigate("/users")
              }
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
            >
              Add Users
            </button>

          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 text-center text-xs text-gray-400">
          IPO Dashboard • IPO Application Management
        </div>

      </main>
      <Footer />
    </div>
  );
}

export default ApplyIpo;
