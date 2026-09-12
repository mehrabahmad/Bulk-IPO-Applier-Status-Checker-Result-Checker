import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Users = () => {
  const navigate = useNavigate();
  const nameRef = useRef(null);

  const API = process.env.REACT_APP_BACKEND_BASE_LINK;
  const token = localStorage.getItem("token");

  // Form state
  const [form, setForm] = useState({
    name: "",
    clientId: "",
    username: "",
    password: "",
    crn: "",
    pin: "",
    tms: "",
  });

  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Simple popup message
  const [message, setMessage] = useState("");

  // Show message
  const showMessage = (msg) => {
    setMessage(msg);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // Fetch users
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Edit record
  const editRecord = (record) => {
    setEditId(record._id);

    setForm({
      name: record.name || "",
      clientId: record.clientId || "",
      username: record.username || "",
      password: record.password || "",
      crn: record.crn || "",
      pin: record.pin || "",
      tms: record.tms || "",
    });

    setShowForm(true);

    setTimeout(() => {
      nameRef.current?.focus();
    }, 100);
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      clientId: "",
      username: "",
      password: "",
      crn: "",
      pin: "",
      tms: "",
    });

    setEditId(null);
    setShowForm(false);
  };

  // Add / Update record
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API}/users/${editId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        showMessage("Record updated successfully!");
      } else {
        await axios.post(`${API}/users`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        showMessage("Record added successfully!");
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error("Operation failed:", error);

      showMessage("Operation failed!");
    }
  };

  // Delete record
  const deleteRecord = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      await axios.delete(`${API}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showMessage("Record deleted successfully!");

      fetchData();
    } catch (error) {
      console.error("Delete failed:", error);

      showMessage("Failed to delete record!");
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      {/* Simple Popup */}
      {message && (
        <div className="fixed right-5 top-5 z-100 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {message}
        </div>
      )}

      <Header />

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page Heading */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Users
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your IPO user accounts and credentials.
            </p>
          </div>

          {/* Add Button */}
          {!showForm && (
            <button
              onClick={() => {
                setEditId(null);

                setForm({
                  name: "",
                  clientId: "",
                  username: "",
                  password: "",
                  crn: "",
                  pin: "",
                  tms: "",
                });

                setShowForm(true);

                setTimeout(() => {
                  nameRef.current?.focus();
                }, 100);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700"
            >
              <span className="text-lg">+</span>
              Add New Record
            </button>
          )}

        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-white/70 bg-white shadow-xl">

            {/* Form Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">

              <div>
                <h3 className="font-semibold text-gray-900">
                  {editId ? "Edit User" : "Add New User"}
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  {editId
                    ? "Update the user's information below."
                    : "Enter the user's information below."}
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                ×
              </button>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6">

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Name
                  </label>

                  <input
                    ref={nameRef}
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* Client ID */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Client ID
                  </label>

                  <input
                    type="text"
                    name="clientId"
                    value={form.clientId}
                    onChange={handleChange}
                    required
                    placeholder="Enter client ID"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Username
                  </label>

                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter username"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Password
                  </label>

                  <input
                    type="text"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* CRN */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    CRN
                  </label>

                  <input
                    type="text"
                    name="crn"
                    value={form.crn}
                    onChange={handleChange}
                    required
                    placeholder="Enter CRN"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* PIN */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    PIN
                  </label>

                  <input
                    type="text"
                    name="pin"
                    value={form.pin}
                    onChange={handleChange}
                    required
                    placeholder="Enter PIN"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* TMS */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    TMS
                  </label>

                  <input
                    type="text"
                    name="tms"
                    value={form.tms}
                    onChange={handleChange}
                    required
                    placeholder="Enter TMS"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

              </div>

              {/* Form Buttons */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700"
                >
                  {editId ? "Update Record" : "Add Record"}
                </button>

              </div>

            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-hidden rounded-2xl border border-white/70 bg-white shadow-xl">

          {/* Table Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">

            <div>
              <h3 className="font-semibold text-gray-900">
                User Records
              </h3>

              <p className="mt-0.5 text-xs text-gray-500">
                {users.length} {users.length === 1 ? "record" : "records"} available
              </p>
            </div>

            <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              {users.length} Users
            </div>

          </div>

          {/* Table */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] text-left">

              <thead className="bg-gray-50/80">

                <tr>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    S.N.
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Name
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Client ID
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Username
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Password
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    CRN
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    PIN
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    TMS
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {users.length === 0 ? (

                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                        👤
                      </div>

                      <h3 className="mt-4 font-semibold text-gray-900">
                        No users found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Add your first user record to get started.
                      </p>
                    </td>
                  </tr>

                ) : (

                  users.map((user, index) => (

                    <tr
                      key={user._id}
                      className="group transition hover:bg-blue-50/40"
                    >

                      {/* S.N. */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-500">
                        {index + 1}
                      </td>

                      {/* Name */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </span>
                      </td>

                      {/* Client ID */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        {user.clientId}
                      </td>

                      {/* Username */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        {user.username}
                      </td>

                      {/* Password */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 font-mono text-xs text-gray-700">
                          {user.password}
                        </span>
                      </td>

                      {/* CRN */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        {user.crn}
                      </td>

                      {/* PIN */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 font-mono text-xs text-gray-700">
                          {user.pin}
                        </span>
                      </td>

                      {/* TMS */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        {user.tms}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() => editRecord(user)}
                            className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteRecord(user._id)}
                            className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          IPO Dashboard • User Management
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default Users;

 