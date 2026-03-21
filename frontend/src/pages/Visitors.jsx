import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, LogOut } from "lucide-react";

export default function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [flats, setFlats] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ name: "", flatNumber: "", purpose: "guest" });

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // <-- use consistent key
  const userFlat = localStorage.getItem("flatNumber"); // optional: if you store resident flat
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch visitors
  const fetchVisitors = async () => {
    try {
      const res = await axios.get("http://smart-society-agm0.onrender.com/api/visitors", config);

      let data = res.data;

      // If resident, filter only their flat visitors
      if (userRole === "resident") {
        data = data.filter(v => v.flatNumber === userFlat);
      }

      setVisitors(
        data.map(v => ({
          ...v,
          status: v.exitTime ? "exited" : "inside",
        }))
      );
    } catch (err) {
      console.error("Fetch visitors error:", err.response?.data || err);
    }
  };

  // Fetch flats for dropdown (only for security)
  const fetchFlats = async () => {
    try {
      const res = await axios.get("http://smart-society-agm0.onrender.com/api/flats", config);
      setFlats(res.data);
    } catch (err) {
      console.error("Fetch flats error:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchVisitors();
    if (userRole === "security") fetchFlats();
  }, []);

  // Add visitor (security only)
  const addVisitor = async () => {
    if (!form.name || !form.flatNumber || !form.purpose) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://smart-society-agm0.onrender.com/api/visitors", form, config);
      setForm({ name: "", flatNumber: "", purpose: "guest" });
      setShowForm(false);
      fetchVisitors();
    } catch (err) {
      console.error("Add visitor error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add visitor");
    }
  };

  const checkout = async (id) => {
    try {
      await axios.put(`http://smart-society-agm0.onrender.com/api/visitors/${id}/exit`, {}, config);
      fetchVisitors();
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err);
    }
  };

  const filteredVisitors = visitors
    .filter(v => filter === "all" || v.status === filter)
    .filter(
      v =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.flatNumber.includes(search)
    );

  const todayCount = visitors.length;
  const insideCount = visitors.filter(v => v.status === "inside").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-white to-purple-300 p-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
            <h1 className="text-3xl font-extrabold flex items-center">
  <span className="mr-2">🛎️</span>
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-indigo-400">
    Visitor Logger
  </span>
</h1>
          <p className="text-gray-500 text-sm text-indigo-500">Log and monitor all visitors</p>
        </div>

        {/* Security can add visitors */}
        {userRole === "security" && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
          >
            <Plus size={16} /> Log Visitor
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-indigo-100 p-4 rounded-xl">
          <p className="text-indigo-700 text-sm">Total Visitors</p>
          <p className="text-2xl font-bold">{todayCount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl">
          <p className="text-green-700 text-sm">Currently Inside</p>
          <p className="text-2xl font-bold">{insideCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search name or flat..."
          className="border px-3 py-2 rounded-lg w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
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
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.map(v => (
              <tr key={v._id} className="border-t">
                <td className="p-3">{v.name}</td>
                <td className="p-3 capitalize">{v.purpose}</td>
                <td className="p-3">{v.flatNumber}</td>
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
                <td className="p-3">
                  {userRole === "security" && v.status === "inside" && (
                    <button
                      onClick={() => checkout(v._id)}
                      className="text-red-500 flex items-center gap-1 hover:text-red-700"
                    >
                      <LogOut size={14} /> Check Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredVisitors.length === 0 && (
          <p className="text-center p-6 text-gray-400">No visitors found</p>
        )}
      </div>

      {/* Add Visitor Modal */}
      {showForm && userRole === "security" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <h2 className="text-lg font-bold">Add Visitor</h2>

            <input
              type="text"
              placeholder="Visitor Name"
              className="border w-full px-3 py-2 rounded-lg"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <select
              className="border w-full px-3 py-2 rounded-lg"
              value={form.flatNumber}
              onChange={(e) => setForm({ ...form, flatNumber: e.target.value })}
            >
              <option value="">Select Flat</option>
              {flats.map(f => (
                <option key={f._id} value={f.flat_number}>
                  {f.flat_number} - {f.owner_name}
                </option>
              ))}
            </select>

            <select
              className="border w-full px-3 py-2 rounded-lg"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            >
              <option value="guest">Guest</option>
              <option value="delivery">Delivery</option>
              <option value="service">Service</option>
              <option value="cab">Cab</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button onClick={addVisitor} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
