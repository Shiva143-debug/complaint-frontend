import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  const handleItemClick = (path) => {
    setActive(path);
  };

  return (
    <div className="sidebar">
      <nav>
        <ul className="sidebar-nav">
          <li>
            <Link
              to="/"
              onClick={() => handleItemClick("/")}
              className={`sidebar-item ${active === "/" ? "active" : ""}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/complaints"
              onClick={() => handleItemClick("/complaints")}
              className={`sidebar-item ${active === "/complaints" ? "active" : ""}`}
            >
              Complaints
            </Link>
          </li>
          <li>
            <Link
              to="/my-complaints"
              onClick={() => handleItemClick("/my-complaints")}
              className={`sidebar-item ${active === "/my-complaints" ? "active" : ""}`}
            >
              My Complaints
            </Link>
          </li>
          <li>
            <Link
              to="/users"
              onClick={() => handleItemClick("/users")}
              className={`sidebar-item ${active === "/users" ? "active" : ""}`}
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              to="/officers"
              onClick={() => handleItemClick("/officers")}
              className={`sidebar-item ${active === "/officers" ? "active" : ""}`}
            >
              Officers
            </Link>
          </li>
          <li>
            <Link
              to="/roles"
              onClick={() => handleItemClick("/roles")}
              className={`sidebar-item ${active === "/roles" ? "active" : ""}`}
            >
              Role Management
            </Link>
          </li>
          <li>
            <Link
              to="/reports"
              onClick={() => handleItemClick("/reports")}
              className={`sidebar-item ${active === "/reports" ? "active" : ""}`}
            >
              Reports
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
