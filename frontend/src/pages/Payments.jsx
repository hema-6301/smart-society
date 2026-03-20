import { useEffect, useState } from "react";
import axios from "axios";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [residents, setResidents] = useState([]);
  const [form, setForm] = useState({ userId: "", flatNumber: "", month: "", amount: "", status: "Pending" });
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payments", config);
      setPayments(res.data);
    } catch (err) {
      console.error("Fetch payments error:", err);
    }
  };

  const fetchResidents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/residents", config);
      setResidents(res.data);
    } catch (err) {
      console.error("Fetch residents error:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchResidents();
  }, []);

  const savePayment = async () => {
    try {
      if (!form.userId || !form.flatNumber || !form.month || !form.amount) {
        alert("Please fill all fields");
        return;
      }
      await axios.post("http://localhost:5000/api/payments", form, config);
      setForm({ userId: "", flatNumber: "", month: "", amount: "", status: "Pending" });
      setOpen(false);
      fetchPayments();
    } catch (err) {
      console.error("Save payment error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to save payment");
    }
  };

  const markPaid = async (p) => {
    try {
      await axios.put(`http://localhost:5000/api/payments/${p._id}`, { status: "Paid" }, config);
      fetchPayments();
    } catch (err) {
      console.error("Update status error:", err.response?.data || err);
    }
  };

  const duesPerFlat = payments.reduce((acc, p) => {
    if (p.status === "Pending") {
      acc[p.flatNumber] = (acc[p.flatNumber] || 0) + p.amount;
    }
    return acc;
  }, {});

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-pink-200 via-white to-indigo-300">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-extrabold flex items-center">
  <span className="mr-2">💸</span>
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-indigo-400">
    Maintenance Payments
  </span>
</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-xl shadow-md hover:shadow-indigo-300/50 transition"
        >
          + Add Payment
        </button>
      </div>

      {/* Pending per Flat */}
      <div className="mb-6 bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-indigo-600 mb-3">Total Pending per Flat</h2>
        <div className="space-y-2">
          {Object.entries(duesPerFlat).map(([flat, amt]) => (
            <div
              key={flat}
              className="flex justify-between items-center bg-gradient-to-r from-pink-50 to-indigo-50 p-3 rounded-lg shadow-sm"
            >
              <span className="font-medium text-gray-700">Flat {flat}</span>
              <span className="font-bold text-indigo-600">₹{amt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-xl shadow-lg bg-white/70 backdrop-blur-md border border-gray-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-pink-100 to-indigo-100">
            <tr>
              <th className="p-3 text-left text-indigo-700">Flat</th>
              <th className="p-3 text-left text-indigo-700">Resident</th>
              <th className="p-3 text-left text-indigo-700">Month</th>
              <th className="p-3 text-left text-indigo-700">Amount</th>
              <th className="p-3 text-left text-indigo-700">Status</th>
              <th className="p-3 text-left text-indigo-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-t hover:bg-pink-50 transition">
                <td className="p-3">{p.flatNumber}</td>
                <td className="p-3">{p.user?.name || "N/A"}</td>
                <td className="p-3">{p.month}</td>
                <td className="p-3 font-semibold">₹{p.amount}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      p.status === "Paid"
                        ? "bg-green-200 text-green-700 shadow-sm shadow-green-300/50"
                        : "bg-pink-200 text-pink-700 shadow-sm shadow-pink-300/50"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3">
                  {p.status === "Pending" && (
                    <button
                      onClick={() => markPaid(p)}
                      className="text-green-600 hover:underline font-medium"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Payment Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl w-96 shadow-2xl border border-pink-200 hover:shadow-pink-300/50 transition">
            <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-indigo-400 mb-6">
              Add Payment
            </h2>

            <select
              className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-pink-300 bg-white/70"
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            >
              <option value="">Select Resident</option>
              {residents.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name} ({r.flatNumber})
                </option>
              ))}
            </select>

            <input
              placeholder="Flat Number"
              className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-pink-300 bg-white/70"
              value={form.flatNumber}
              onChange={(e) => setForm({ ...form, flatNumber: e.target.value })}
            />
            <input
              placeholder="Month"
              className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-pink-300 bg-white/70"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
            />
            <input
              type="number"
              placeholder="Amount"
              className="w-full border p-2 rounded-lg mb-6 focus:ring-2 focus:ring-pink-300 bg-white/70"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={savePayment}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 hover:shadow-indigo-300/50 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}