import { useState, useEffect } from "react";
import axios from "axios";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(
        "https://smart-society-agm0.onrender.com/api/complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setComplaints(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addComplaint = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://smart-society-agm0.onrender.com/api/complaints",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setForm({ title: "", description: "" });
      fetchComplaints();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-10">
      <h2 className="text-3xl font-bold mb-6 text-indigo-600 text-center">
        🛠️ My Complaints
      </h2>

      {/* Complaint Form */}
      <form
        onSubmit={addComplaint}
        className="bg-white shadow-md rounded-lg p-6 mb-6 transition duration-300 hover:shadow-lg"
      >
        <input
          type="text"
          placeholder="Complaint Title"
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-300"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Write complaint description..."
          className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-300"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <button className="bg-indigo-400 hover:bg-indigo-500 text-white px-5 py-2 rounded transition duration-300 shadow hover:shadow-md">
          Submit Complaint
        </button>
      </form>

      {/* Complaint List */}
      <div className="bg-white shadow-md rounded-lg p-6 transition duration-300 hover:shadow-lg">
        {complaints.length === 0 ? (
          <p className="text-gray-500 text-center">No Complaints Yet</p>
        ) : (
          complaints.map((c) => (
            <div
              key={c._id}
              className="border p-3 mb-3 rounded transition duration-300 shadow-sm hover:shadow-md"
            >
              <h3 className="font-semibold text-indigo-700">{c.title}</h3>
              <p className="text-gray-700">{c.description}</p>
              <p className="text-sm text-gray-500">Status: {c.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyComplaints;
