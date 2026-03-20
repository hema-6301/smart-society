import { useEffect, useState } from "react";
import { IndianRupee, Wrench, ShieldCheck, Users } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import axios from "axios";

const BAR_COLORS = ["#a8d513", "#18cbeb"]; // Collected, Pending
const PIE_COLORS = ["#da0c39", "#fbbf24", "#22bc65"]; // Pending, In Progress, Resolved

export default function Dashboard() {
  const [flats, setFlats] = useState([]);
  const [dues, setDues] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flatsRes, paymentsRes, ticketsRes, visitorsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/flats", config),
          axios.get("http://localhost:5000/api/payments", config),
          axios.get("http://localhost:5000/api/complaints", config),
          axios.get("http://localhost:5000/api/visitors", config)
        ]);

        setFlats(flatsRes.data || []);
        setDues(paymentsRes.data || []);
        setTickets(ticketsRes.data || []);
        setVisitors(visitorsRes.data || []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Calculations
  const totalDues = dues.filter(d => d.status === "Pending").reduce((s, d) => s + (d.amount || 0), 0);
  const totalCollected = dues.filter(d => d.status === "Paid").reduce((s, d) => s + (d.amount || 0), 0);
  const openTickets = tickets.filter(t => t.status !== "Resolved").length;
  const todayVisitors = visitors.filter(v => {
    const d = new Date(v.createdAt || v.check_in);
    return d.toDateString() === new Date().toDateString();
  }).length;

  const ticketStatusData = [
    { name: "Pending", value: tickets.filter(t => t.status === "Pending").length },
    { name: "In Progress", value: tickets.filter(t => t.status === "In Progress").length },
    { name: "Resolved", value: tickets.filter(t => t.status === "Resolved").length },
  ];

  const financeData = [
    { name: "Collected", amount: totalCollected },
    { name: "Pending", amount: totalDues },
  ];

  const statCards = [
    { label: "Total Flats", value: flats.length, icon: Users, light: "bg-indigo-200 text-indigo-700", glow: "hover:shadow-indigo-300/50" },
    { label: "Dues Pending", value: `₹${totalDues.toLocaleString()}`, icon: IndianRupee, light: "bg-pink-200 text-pink-700", glow: "hover:shadow-pink-300/50" },
    { label: "Open Tickets", value: openTickets, icon: Wrench, light: "bg-yellow-200 text-yellow-700", glow: "hover:shadow-yellow-300/50" },
    { label: "Today's Visitors", value: todayVisitors, icon: ShieldCheck, light: "bg-green-200 text-green-700", glow: "hover:shadow-green-300/50" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-screen text-indigo-400">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-300 border-t-indigo-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-lavender to-indigo-200 p-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold">
  <span className="text-black">🏡</span>{" "}
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-indigo-400">
    Society Dashboard
  </span>
</h1>
          <p className="text-gray-600 text-sm mt-2">Overview of your community</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map(({ label, value, icon: Icon, light, glow }) => (
            <div
              key={label}
              className={`rounded-2xl p-6 bg-white/70 backdrop-blur-md border border-gray-200 shadow-md transition hover:scale-105 ${glow}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${light} shadow-md`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-extrabold text-gray-800">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Cinematic Finance Bar Chart */}
          <div className="rounded-2xl p-6 bg-white/70 backdrop-blur-md border border-gray-200 shadow-md">
            <h2 className="font-semibold text-indigo-600 mb-4">Financial Overview</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={financeData}>
                <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 12 }} />
                <YAxis tick={{ fill: "#555", fontSize: 12 }} />
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Bar dataKey="amount" radius={[6,6,0,0]}>
                  {financeData.map((entry, index) => (
                    <Cell key={index} fill={`url(#barGradient${index})`} />
                  ))}
                </Bar>
                <defs>
                  {financeData.map((entry, index) => (
                    <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={BAR_COLORS[index]} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={BAR_COLORS[index]} stopOpacity={0.4} />
                    </linearGradient>
                  ))}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ticket Status PieChart */}
          <div className="rounded-2xl p-6 bg-white/70 backdrop-blur-md border border-gray-200 shadow-md">
            <h2 className="font-semibold text-indigo-600 mb-4">Ticket Status</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
  <Pie
    data={ticketStatusData}
    cx="50%" cy="50%"
    innerRadius={55} outerRadius={85}
    dataKey="value" paddingAngle={6}
  >
    {ticketStatusData.map((_, i) => (
      <Cell key={i} fill={PIE_COLORS[i]} stroke="white" strokeWidth={2} />
    ))}
  </Pie>
  <Tooltip
    contentStyle={{
      backgroundColor: "rgba(255,255,255,0.9)",
      borderRadius: "8px",
      border: "1px solid #ddd",
      fontSize: "12px"
    }}
  />
  <Legend wrapperStyle={{ fontSize: "12px", color: "#4292dd" }} />
</PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="rounded-2xl shadow-md bg-white/70 backdrop-blur-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-pink-100 to-indigo-100">
            <h2 className="font-semibold text-indigo-600">Recent Maintenance Tickets</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {tickets.slice(0,5).map(t => (
              <div key={t._id || t.id} className="px-6 py-4 flex items-center justify-between hover:bg-pink-50 transition">
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.title}</p>
                  <p className="text-xs text-gray-500">Flat {t.flatNumber || t.flat_number} · {t.category || "Maintenance"}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  t.status === "Resolved" ? "bg-green-200 text-green-700" :
                  t.status === "In Progress" ? "bg-yellow-200 text-yellow-700" :
                  "bg-pink-200 text-pink-700"
                }`}>
                  {t.status.replace("_", " ")}
                </span>
              </div>
            ))}
            {tickets.length === 0 && (
              <p className="px-6 py-4 text-sm text-gray-400">No tickets yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}