import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ApplyIpo from "./pages/applyIpo";
import CheckStatus from "./pages/checkStatus";

function Home() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]); // store JSON data

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];

    if (!uploadedFile.name.endsWith(".json")) {
      alert("⚠️ Please upload a JSON file only");
      return;
    }

    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        setUsers(parsedData);
      } catch (err) {
        alert("❌ Invalid JSON file");
        console.error(err);
      }
    };
    reader.readAsText(uploadedFile);
  };

  const handleNavigate = (path) => {
    if (!file) {
      alert("⚠️ Please upload a JSON file first!");
      return;
    }
    navigate(path, { state: { users } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-lg w-full border border-gray-100 text-center transition-transform duration-300 hover:scale-[1.02]">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          IPO Management System
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          Upload your user JSON file to manage IPO applications
        </p>

        {/* File Upload */}
        <div className="flex flex-col items-center justify-center mb-8">
          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            {file ? "File Uploaded ✅" : "Upload JSON File"}
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
          {file && (
            <p className="text-sm text-green-600 mt-3 font-medium">
              {file.name}
            </p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleNavigate("/apply")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-all duration-300 w-full sm:w-auto"
          >
            Apply IPO
          </button>
          <button
            onClick={() => handleNavigate("/status")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition-all duration-300 w-full sm:w-auto"
          >
            Check Status
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<ApplyIpo />} />
        <Route path="/status" element={<CheckStatus />} />
      </Routes>
    </Router>
  );
}

export default App;
