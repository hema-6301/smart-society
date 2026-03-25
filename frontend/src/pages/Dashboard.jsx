import { useEffect, useMemo, useState } from "react";
import { IndianRupee, Wrench, ShieldCheck, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Sector,
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
  const [error, setError] = useState(null);

  // UI interaction states for hover effects
  const [activeBarIndex, setActiveBarIndex] = useState(null);
  const [activePieIndex, setActivePieIndex] = useState(null);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [flatsRes, paymentsRes, ticketsRes, visitorsRes] = await Promise.all([
          axios.get("https://smart-society-agm0.onrender.com/api/flats", config),
          axios.get("https://smart-society-agm0.onrender.com/api/payments", config),
          axios.get("https://smart-society-agm0.onrender.com/api/complaints", config),
          axios.get("https://smart-society-agm0.onrender.com/api/visitors", config),
        ]);

        setFlats(flatsRes.data || []);
        setDues(paymentsRes.data || []);
        setTickets(ticketsRes.data || []);
        setVisitors(visitorsRes.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Memoized calculations for performance
  const totalDues = useMemo(
    () =>
      dues
        .filter((d) => d.status === "Pending")
        .reduce((s, d) => s + (Number(d.amount) || 0), 0),
    [dues]
  );

  const totalCollected = useMemo(
    () =>
      dues
        .filter((d) => d.status === "Paid")
        .reduce((s, d) => s + (Number(d.amount) || 0), 0),
    [dues]
  );

  const openTickets = useMemo(
    () => tickets.filter((t) => t.status !== "Resolved").length,
    [tickets]
  );

  const todayVisitors = useMemo(() => {
    const today = new Date().toDateString();
    return visitors.filter((v) => {
      const d = new Date(v.createdAt || v.check_in || v.checkIn || v.created_at);
      return d.toDateString() === today;
    }).length;
  }, [visitors]);

  const ticketStatusData = useMemo(
    () => [
      { name: "Pending", value: tickets.filter((t) => t.status === "Pending").length },
      { name: "In Progress", value: tickets.filter((t) => t.status === "In Progress").length },
      { name: "Resolved", value: tickets.filter((t) => t.status === "Resolved").length },
    ],
    [tickets]
  );

  const financeData = useMemo(
    () => [
      { name: "Collected", amount: totalCollected },
      { name: "Pending", amount: totalDues },
    ],
    [totalCollected, totalDues]
  );

  const statCards = [
    {
      label: "Total Flats",
      value: flats.length,
      icon: Users,
      light: "bg-indigo-100 text-indigo-700",
      glow: "hover:shadow-indigo-300/40",
    },
    {
      label: "Dues Pending",
      value: `₹${totalDues.toLocaleString()}`,
      icon: IndianRupee,
      light: "bg-pink-100 text-pink-700",
      glow: "hover:shadow-pink-300/40",
    },
    {
      label: "Open Tickets",
      value: openTickets,
      icon: Wrench,
      light: "bg-yellow-100 text-yellow-700",
      glow: "hover:shadow-yellow-300/40",
    },
    {
      label: "Today's Visitors",
      value: todayVisitors,
      icon: ShieldCheck,
      light: "bg-green-100 text-green-700",
      glow: "hover:shadow-green-300/40",
    },
  ];

  // Active pie slice renderer (expands slice and shows label)
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 18) * cos;
    const my = cy + (outerRadius + 18) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;

    return (
      <g>
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#111" fontSize={12} fontWeight={700}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 8 : -8)} y={ey} textAnchor={cos >= 0 ? "start" : "end"} fill="#333" fontSize={12}>
          {`${value} (${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-indigo-400">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-300 border-t-indigo-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-indigo-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold">
            <span className="text-black">🏡</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-500">
              Society Dashboard
            </span>
          </h1>
          <p className="text-gray-600 text-sm mt-2">Overview of your community</p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-md bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map(({ label, value, icon: Icon, light, glow }) => (
            <div
              key={label}
              className={`rounded-2xl p-5 bg-white/80 backdrop-blur-md border border-gray-200 transition transform hover:scale-105 hover:-translate-y-1 ${glow} cursor-default`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${light} shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-gray-800 transition-all">{value}</p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Financial Bar Chart */}
          <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm transition hover:shadow-lg hover:-translate-y-1">
            <h2 className="font-semibold text-indigo-600 mb-4">Financial Overview</h2>

            {financeData.every((d) => d.amount === 0) ? (
              <div className="flex items-center justify-center h-44 text-gray-400">
                No financial data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={financeData}>
                  <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#555", fontSize: 12 }} />
                  <Tooltip
                    formatter={(v) => `₹${v.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      borderRadius: 8,
                      border: "1px solid #eee",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {financeData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={`url(#barGradient${index})`}
                        onMouseEnter={() => setActiveBarIndex(index)}
                        onMouseLeave={() => setActiveBarIndex(null)}
                        style={{
                          transition: "transform 180ms ease, filter 180ms ease",
                          transform: activeBarIndex === index ? "scale(1.06)" : "scale(1)",
                          filter: activeBarIndex === index ? "drop-shadow(0 6px 14px rgba(0,0,0,0.12))" : "none",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </Bar>

                  <defs>
                    {financeData.map((entry, index) => (
                      <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={BAR_COLORS[index]} stopOpacity={0.95} />
                        <stop offset="100%" stopColor={BAR_COLORS[index]} stopOpacity={0.45} />
                      </linearGradient>
                    ))}
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Ticket Status Pie Chart */}
          <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm transition hover:shadow-lg hover:-translate-y-1">
            <h2 className="font-semibold text-indigo-600 mb-4">Ticket Status</h2>

            {ticketStatusData.every((d) => d.value === 0) ? (
              <div className="flex items-center justify-center h-44 text-gray-400">No tickets to display</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={ticketStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    paddingAngle={6}
                    activeIndex={activePieIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => setActivePieIndex(index)}
                    onMouseLeave={() => setActivePieIndex(null)}
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {ticketStatusData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={PIE_COLORS[i]}
                        stroke="white"
                        strokeWidth={2}
                        style={{
                          cursor: "pointer",
                          transition: "transform 180ms ease, filter 180ms ease",
                        }}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      borderRadius: "8px",
                      border: "1px solid #eee",
                      fontSize: "12px",
                    }}
                    formatter={(value, name) => [`${value}`, `${name}`]}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", color: "#4b6cb7" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="rounded-2xl shadow-md bg-white/80 backdrop-blur-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-indigo-50">
            <h2 className="font-semibold text-indigo-600">Recent Maintenance Tickets</h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
            {tickets.slice(0, 5).map((t) => (
              <div
                key={t._id || t.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-pink-50 transition cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.title}</p>
                  <p className="text-xs text-gray-500">
                    Flat {t.flatNumber || t.flat_number || t.flat || "—"} · {t.category || "Maintenance"}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    t.status === "Resolved"
                      ? "bg-green-200 text-green-700"
                      : t.status === "In Progress"
                      ? "bg-yellow-200 text-yellow-700"
                      : "bg-pink-200 text-pink-700"
                  }`}
                >
                  {String(t.status).replace("_", " ")}
                </span>
              </div>
            ))}
            {tickets.length === 0 && <p className="px-6 py-4 text-sm text-gray-400">No tickets yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
