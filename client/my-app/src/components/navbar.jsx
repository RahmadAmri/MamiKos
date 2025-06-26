import { NavLink, useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="navbar bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg mb-10">
      <div className="navbar-start">
        <NavLink
          to="/"
          className="text-2xl font-bold tracking-wide hover:text-blue-200 transition-colors duration-200"
        >
          Mami Kos
        </NavLink>
      </div>
      <div className="navbar-end space-x-4">
        {isLoggedIn ? (
          <>
            <NavLink
              to="/cms"
              className="btn btn-ghost btn-sm hover:bg-blue-700/50"
            >
              CMS
            </NavLink>
            <NavLink
              to="/add-edit"
              className="btn btn-ghost btn-sm hover:bg-blue-700/50"
            >
              Add Lodging
            </NavLink>
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm hover:bg-blue-700/50"
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className="btn btn-ghost btn-sm hover:bg-blue-700/50"
          >
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
}
