import { useState, useEffect } from "react";
import axios from "axios";

const empty = {
  flat_number: "",
  owner_name: "",
  owner_email: "",
  owner_phone: "",
  floor: "",
  block: "",
  status: "occupied"
};

export default function Flats() {
  const [flats, setFlats] = useState([]);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch flats
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
      setForm({
        ...flat,
        owner_name: flat.owner_name || "",
        owner_email: flat.owner_email || "",
        owner_phone: flat.owner_phone || ""
      });
      setEditingId(flat._id);
    } else {
      setForm(empty);
      setEditingId(null);
    }
    setOpen(true);
  };

  // ✅ SAVE FLAT (FIXED)
  const saveFlat = async () => {
    try {
      if (!form.flat_number) {
        alert("Flat number is required");
        return;
      }

      if (form.status === "occupied" && !form.owner_name) {
        alert("Owner name is required for occupied flats");
        return;
      }

      let data = { ...form };

      // 🔥 IMPORTANT FIX
      if (form.status === "vacant") {
        data.owner_name = null;
        data.owner_email = null;
        data.owner_phone = null;
      }

      if (editingId) {
        await axios.put(
          `https://smart-society-agm0.onrender.com/api/flats/${editingId}`,
          data,
          config
        );
      } else {
        await axios.post(
          "https://smart-society-agm0.onrender.com/api/flats",
          data,
          config
        );
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
      await axios.delete(
        `https://smart-society-agm0.onrender.com/api/flats/${id}`,
        config
      );
      fetchFlats();
    } catch (err) {
      console.error("Delete flat error:", err.response?.data || err);
    }
  };

  // ✅ SAFE SEARCH FIX
  const filtered = flats.filter(f =>
    f.flat_number.toLowerCase().includes(search.toLowerCase()) ||
    (f.owner_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-gradient-to-br from-indigo-200 via-white to-purple-200 rounded-xl shadow-lg">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-indigo-800">
          🏢 Flats & Residents
        </h1>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Flat
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Flats List */}
      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map(f => (
          <div key={f._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">Flat {f.flat_number}</h3>
            <p>Status: {f.status}</p>
            <p>{f.owner_name || "No Owner"}</p>

            <div className="flex gap-2 mt-2">
              <button onClick={() => openModal(f)}>Edit</button>
              <button onClick={() => deleteFlat(f._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">

            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Flat" : "Add Flat"}
            </h2>

            {/* Flat Number */}
            <input
              type="text"
              placeholder="Flat Number"
              value={form.flat_number}
              onChange={(e) =>
                setForm({ ...form, flat_number: e.target.value })
              }
              className="w-full border p-2 mb-2"
            />

            {/* Status */}
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="w-full border p-2 mb-2"
            >
              <option value="occupied">Occupied</option>
              <option value="vacant">Vacant</option>
            </select>

            {/* 🔥 Show owner only if occupied */}
            {form.status === "occupied" && (
              <>
                <input
                  type="text"
                  placeholder="Owner Name"
                  value={form.owner_name}
                  onChange={(e) =>
                    setForm({ ...form, owner_name: e.target.value })
                  }
                  className="w-full border p-2 mb-2"
                />

                <input
                  type="text"
                  placeholder="Email"
                  value={form.owner_email}
                  onChange={(e) =>
                    setForm({ ...form, owner_email: e.target.value })
                  }
                  className="w-full border p-2 mb-2"
                />

                <input
                  type="text"
                  placeholder="Phone"
                  value={form.owner_phone}
                  onChange={(e) =>
                    setForm({ ...form, owner_phone: e.target.value })
                  }
                  className="w-full border p-2 mb-2"
                />
              </>
            )}

            {/* Block & Floor */}
            <input
              type="text"
              placeholder="Block"
              value={form.block}
              onChange={(e) =>
                setForm({ ...form, block: e.target.value })
              }
              className="w-full border p-2 mb-2"
            />

            <input
              type="text"
              placeholder="Floor"
              value={form.floor}
              onChange={(e) =>
                setForm({ ...form, floor: e.target.value })
              }
              className="w-full border p-2 mb-2"
            />

            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button onClick={saveFlat} className="bg-indigo-600 text-white px-3 py-1 rounded">
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
