import { useState, useEffect } from "react";
import { Plus, Wrench } from "lucide-react";

export default function Complaints() {

  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  const token = localStorage.getItem("token");

  const getRole = () => {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  };

  const role = getRole();


  // FETCH COMPLAINTS
  const fetchComplaints = async () => {
    try {

      const res = await fetch("https://smart-society-agm0.onrender.com/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);

    } catch (err) {
      console.log(err);
      setComplaints([]);
    }
  };


  useEffect(() => {
    fetchComplaints();
  }, []);



  // ADD COMPLAINT
  const addComplaint = async () => {

    if (role !== "resident") return;

    try {

      await fetch("https://smart-society-agm0.onrender.com/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      setForm({ title: "", description: "" });
      setShowForm(false);
      fetchComplaints();

    } catch (err) {
      console.log(err);
    }
  };


  // UPDATE STATUS
  const updateStatus = async (id, status) => {

    if (role !== "admin") return;

    try {

      await fetch(`https://smart-society-agm0.onrender.com/api/complaints/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      fetchComplaints();

    } catch (err) {
      console.log(err);
    }
  };


  const statusColor = (status) => {
    if (status === "Pending") return "bg-red-100 text-red-700";
    if (status === "In Progress") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };


  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-white to-purple-300 p-10">

      <div className="max-w-6xl mx-auto space-y-8">

        <div className="flex justify-between items-center">

          <div>
              <h1 className="text-3xl font-extrabold flex items-center">
  <span className="mr-2">🛠️</span>
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-indigo-400">
    Maintenance Complaints
  </span>
</h1>
            <p className="text-gray-600 text-sm">
              Manage society issues
            </p>
          </div>


          {role === "resident" && (

            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow-md"
            >
              <Plus size={16} /> New Complaint
            </button>

          )}

        </div>



        {/* Complaints List */}

        <div className="space-y-5">

          {complaints.map((c) => (

            <div
              key={c._id}
              className="bg-white p-6 rounded-xl shadow-md border"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="font-semibold text-lg flex items-center gap-2 text-emerald-700">
                    <Wrench size={16} />
                    {c.title}
                  </h2>

                  <p className="text-gray-600 text-sm mt-1">
                    {c.description}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Resident: {c.user?.name} (Flat {c.user?.flatNumber})
                  </p>

                </div>


                {role === "admin" ? (

                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c._id, e.target.value)}
                    className={`px-3 py-1 rounded-lg text-sm ${statusColor(c.status)}`}
                  >

                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>

                  </select>

                ) : (

                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${statusColor(c.status)}`}
                  >
                    {c.status}
                  </span>

                )}

              </div>

            </div>

          ))}

        </div>


        {/* Complaint Form Modal */}

        {showForm && role === "resident" && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

            <div className="bg-white p-8 rounded-xl w-96 space-y-5 shadow-2xl">

              <h2 className="text-xl font-bold text-emerald-700">
                Add Complaint
              </h2>

              <input
                type="text"
                placeholder="Complaint Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="border w-full px-3 py-2 rounded-lg"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="border w-full px-3 py-2 rounded-lg"
              />

              <div className="flex justify-end gap-3">

                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={addComplaint}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg"
                >
                  Add
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}
