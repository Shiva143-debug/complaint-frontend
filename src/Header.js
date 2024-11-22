import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header d-flex justify-content-between align-items-center px-4 py-2 shadow-sm vh-20 vw-100">
      <div className="header-logo">
        <h4 className="m-0 text-primary">CompanyLogo</h4>
      </div>
      <button className="btn btn-danger">Logout</button>
    </header>
  );
};

export default Header;
