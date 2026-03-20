import { useState, useEffect } from "react";
import axios from "axios";

export default function ResidentVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch visitors from backend
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/visitors", config);
        if (!Array.isArray(res.data)) {
          setVisitors([]);
          return;
        }
        // Add status field
        const visitorsWithStatus = res.data.map(v => ({
          ...v,
          status: v.exitTime ? "exited" : "inside",
        }));
        setVisitors(visitorsWithStatus);
      } catch (err) {
        console.error("Fetch visitors error:", err.response?.data || err);
        setVisitors([]);
      }
    };

    fetchVisitors();
  }, [token]);

  const filteredVisitors = visitors
    .filter(v => filter === "all" || v.status === filter)
    .filter(v => v.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-white to-purple-300 p-10">
      <h1 className="text-2xl font-bold text-indigo-500 mb-4">🛎️ My Visitors</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border px-3 py-2 rounded-lg w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded-lg"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="inside">Inside</option>
          <option value="exited">Exited</option>
        </select>
      </div>

      {/* Visitors Table */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Visitor</th>
              <th className="p-3 text-left">Purpose</th>
              <th className="p-3 text-left">Flat</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.length > 0
              ? filteredVisitors.map(v => (
                  <tr key={v._id} className="border-t">
                    <td className="p-3">{v.name || "N/A"}</td>
                    <td className="p-3 capitalize">{v.purpose || "N/A"}</td>
                    <td className="p-3">{v.flatNumber || "N/A"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          v.status === "inside"
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))
              : (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-400">
                      No visitors found
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
}