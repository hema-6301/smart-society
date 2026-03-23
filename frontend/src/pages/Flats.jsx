import { useState, useEffect } from "react";
import axios from "axios";

const empty = { flat_number: "", owner_name: "", owner_email: "", owner_phone: "", floor: "", block: "", status: "occupied" };

export default function Flats() {
  const [flats, setFlats] = useState([]);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch flats from backend
  const fetchFlats = async () => {
    try {
      const res = await axios.get("https://smart-society-agm0.onrender.com/api/flats", config);
      setFlats(res.data);
    } catch (err) {
      console.error("Fetch flats error:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  const openModal = (flat = null) => {
    if (flat) {
      setForm(flat);
      setEditingId(flat._id);
    } else {
      setForm(empty);
      setEditingId(null);
    }
    setOpen(true);
  };

  const saveFlat = async () => {
    try {
      if (!form.flat_number || !form.owner_name) {
        alert("Flat number and owner name are required");
        return;
      }

      if (editingId) {
        await axios.put(`https://smart-society-agm0.onrender.com/api/flats/${editingId}`, form, config);
      } else {
        await axios.post("https://smart-society-agm0.onrender.com/api/flats", form, config);
      }

      setForm(empty);
      setEditingId(null);
      setOpen(false);
      fetchFlats();
    } catch (err) {
      console.error("Save flat error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to save flat");
    }
  };

  const deleteFlat = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flat?")) return;
    try {
      await axios.delete(`https://smart-society-agm0.onrender.com/api/flats/${id}`, config);
      fetchFlats();
    } catch (err) {
      console.error("Delete flat error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to delete flat");
    }
  };

  const filtered = flats.filter(f =>
    f.flat_number.toLowerCase().includes(search.toLowerCase()) ||
    f.owner_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-gradient-to-br from-indigo-200 via-white to-purple-200 rounded-xl shadow-lg">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-800">🏢Flats & Residents</h1>
          <p className="text-gray-500 text-sm">Manage all flats and owner information</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2 rounded-lg shadow-md transition flex items-center"
        >
          <span className="mr-2 text-lg">+</span> Add Flat
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search by flat or owner..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 p-3 rounded-lg w-full max-w-sm shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
      />

      {/* Flats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 && <p className="text-gray-400 col-span-3 text-center py-10 italic">No flats found.</p>}
        {filtered.map((f) => (
          <div key={f._id} className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 shadow-md p-6 hover:shadow-pink-500/50 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center shadow-inner">
                  <span className="text-indigo-600 font-bold">🏠</span>
                </div>
                <span className="font-bold text-gray-900 text-lg">Flat {f.flat_number}</span>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium shadow-sm ${f.status === "occupied" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {f.status}
              </span>
            </div>
            <p className="font-semibold text-gray-800">{f.owner_name}</p>
            {f.owner_phone && <p className="text-sm text-gray-500">{f.owner_phone}</p>}
            {f.owner_email && <p className="text-sm text-gray-500">{f.owner_email}</p>}
            {f.block && <p className="text-sm text-gray-400">Block {f.block}{f.floor ? `, Floor ${f.floor}` : ""}</p>}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => openModal(f)}
                className="text-indigo-600 border border-indigo-600 px-4 py-1.5 rounded-lg hover:bg-indigo-50 transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteFlat(f._id)}
                className="text-red-500 border border-red-500 px-4 py-1.5 rounded-lg hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-96 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-indigo-700">{editingId ? "Edit Flat" : "Add New Flat"}</h3>

            <div className="grid grid-cols-2 gap-4">
              {["flat_number","owner_name","owner_email","owner_phone","block","floor"].map(key => (
                <div key={key}>
                  <label className="block text-gray-700 mb-1 font-medium">{key.replace("_"," ").toUpperCase()}</label>
                  <input
                    type="text"
                    value={form[key] || ""}
                    onChange={(e) => setForm({...form, [key]: e.target.value})}
                    className="w-full border border-gray-300 p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              ))}

              <div className="col-span-2">
                <label className="block text-gray-700 mb-1 font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value})}
                  className="w-full border border-gray-300 p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="occupied">Occupied</option>
                  <option value="vacant">Vacant</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setOpen(false)} className="px-5 py-2 rounded-lg border hover:bg-gray-100 transition">Cancel</button>
              <button onClick={saveFlat} className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition shadow-md">Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
