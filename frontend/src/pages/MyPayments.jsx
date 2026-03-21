import { useState, useEffect } from "react";
import axios from "axios";

function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://smart-society-agm0.onrender.com/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // Total pending for this resident
  const totalPending = payments
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const statusColor = (status) => {
    if (status === "Pending") return "bg-yellow-200 text-yellow-800";
    if (status === "Paid") return "bg-green-200 text-green-800";
    return "bg-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-white to-purple-300 p-10">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">💸 My Payments</h1>

      {loading ? (
        <p className="text-center p-5">Loading payments...</p>
      ) : (
        <>
          {/* Total Pending */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Total Pending Amount</h2>
            <p className="text-red-700 font-bold text-lg">₹{totalPending}</p>
          </div>

          {/* Payments Table */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <table className="w-full text-left border">
              <thead className="bg-emerald-500 text-white">
                <tr>
                  <th className="p-3">Flat</th>
                  <th className="p-3">Month</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-5">
                      No Payments Yet
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p._id} className="border-t">
                      <td className="p-3">{p.flatNumber}</td>
                      <td className="p-3">{p.month}</td>
                      <td className="p-3">₹{p.amount}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${statusColor(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default MyPayments;
