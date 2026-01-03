import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import companies from "../components/companies";

const API=process.env.REACT_APP_BACKEND_BASE_LINK;

export default function Users() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    name: "",
    clientId: "",
    username: "",
    password: "",
    crn: "",
    pin: "",
    tms: ""
  });
  const [editId, setEditId] = useState(null);

  const nameRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch {
      navigate("/");
    }
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch {
      navigate("/");
    }
  };

  fetchData();
}, [ token, navigate]);

  /* ================= FOCUS NAME ON EDIT ================= */
  useEffect(() => {
    if (editId) {
      nameRef.current?.focus();
    }
  }, [editId]);

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      clientId: "",
      username: "",
      password: "",
      crn: "",
      pin: "",
      tms: ""
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API}/users/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API}/users`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      resetForm();
      fetchData();
    } catch {
      alert("Operation failed");
    }
  };

  const editRecord = (record) => {
    setEditId(record._id);
    setForm({
      name: record.name,
      clientId: record.clientId,
      username: record.username,
      password: record.password,
      crn: record.crn,
      pin: record.pin,
      tms: record.tms
    });
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    await axios.delete(`${API}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchData();
  };

 

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ===== HEADER ===== */}
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

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===== FORM CARD ===== */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editId ? "Edit Record" : "Add New Record"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              ref={nameRef}
              value={form.name}
              onChange={handleChange}
              placeholder="NAME"
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            
            <select
              name="clientId"
              value={form.clientId}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Select Capital --</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="USERNAME"
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="PASSWORD"
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              name="crn"
              value={form.crn}
              onChange={handleChange}
              placeholder="CRN"
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              name="pin"
              value={form.pin}
              onChange={handleChange}
              placeholder="PIN"
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              name="tms"
              value={form.tms}
              onChange={handleChange}
              placeholder="TMS"
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              {editId ? "Update Record" : "Add Record"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-gray-300 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* ===== TABLE CARD ===== */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">My Records</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Client ID</th>
                <th className="p-3">Username</th>
                <th className="p-3">Password</th>
                <th className="p-3">CRN</th>
                <th className="p-3">PIN</th>
                <th className="p-3">TMS</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d._id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{d.name}</td>
                  <td className="p-3">{d.clientId}</td>
                  <td className="p-3">{d.username}</td>
                  <td className="p-3">{d.password}</td>
                  <td className="p-3">{d.crn}</td>
                  <td className="p-3">{d.pin}</td>
                  <td className="p-3">{d.tms}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => editRecord(d)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRecord(d._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}
