import { useNavigate } from "react-router-dom";
import "./AdminHome.css";

function AdminHome() {
  const navigate = useNavigate();

  const admin = JSON.parse(
    localStorage.getItem("admin") || "null"
  );

  return (
    <div className="admin-dashboard">

      <div className="dashboard-header">

        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Welcome back, {admin?.name || "Admin"}
          </p>
        </div>

      </div>

      <div className="dashboard-grid">

        {/* Upload Product */}

        <div className="dashboard-card">

          <div className="dashboard-card-icon">
            +
          </div>

          <div className="dashboard-card-content">

            <h2>Upload Product</h2>

            <p>
              Add a new product to your store
              catalog.
            </p>

            <button
              onClick={() =>
                navigate("/admin/products/add")
              }
            >
              Upload Product
            </button>

          </div>

        </div>


        {/* View Products */}

        <div className="dashboard-card">

          <div className="dashboard-card-icon">
            ≡
          </div>

          <div className="dashboard-card-content">

            <h2>View Products</h2>

            <p>
              View and manage your existing
              products.
            </p>

            <button
              onClick={() =>
                navigate("/admin/products")
              }
            >
              View Products
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminHome;