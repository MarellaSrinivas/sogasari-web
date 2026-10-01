import {
  Link,
  Outlet,
  useLocation,
  useNavigate
} from "react-router-dom";

import "./AdminLayout.css";

function AdminLayout() {

  const navigate = useNavigate();
  const location = useLocation();

  const admin = JSON.parse(
    localStorage.getItem("admin") || "null"
  );

  const logout = () => {

    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin-login", {
      replace: true
    });
  };

  return (
    <div className="admin-layout">

      {/* Sidebar */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-header">

          <div className="admin-sidebar-logo">
            S
          </div>

          <div>
            <h2>Admin Panel</h2>
            <span>Store Management</span>
          </div>

        </div>


        <nav className="admin-navigation">

          <Link
            to="/admin"
            className={
              location.pathname === "/admin"
                ? "active"
                : ""
            }
          >
            <span>▦</span>
            Dashboard
          </Link>


          <Link
            to="/admin/products/add"
            className={
              location.pathname ===
              "/admin/products/add"
                ? "active"
                : ""
            }
          >
            <span>＋</span>
            Upload Product
          </Link>


          <Link
            to="/admin/products"
            className={
              location.pathname ===
              "/admin/products"
                ? "active"
                : ""
            }
          >
            <span>☷</span>
            View Products
          </Link>

        </nav>


        {/* Bottom */}

        <div className="admin-sidebar-bottom">

          <div className="admin-user">

            <div className="admin-user-avatar">
              {(admin?.name || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <strong>
                {admin?.name || "Admin"}
              </strong>

              <small>
                {admin?.phone || ""}
              </small>

            </div>

          </div>


          <button
            className="admin-logout"
            onClick={logout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* Main */}

      <main className="admin-main">

        <Outlet />

      </main>

    </div>
  );
}

export default AdminLayout;