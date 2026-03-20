import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Users() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Navbar />
        <h2>Users List</h2>

        <div className="card">
          <p>👤 John Doe - Flat 101</p>
          <p>👤 Priya - Flat 202</p>
        </div>
      </div>
    </div>
  );
}

export default Users;