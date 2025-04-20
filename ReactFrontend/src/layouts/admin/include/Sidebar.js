import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      {/* <!-- Sidebar --> */}
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/" >
          
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink"></i>
          </div>
          <div className="sidebar-brand-text mx-1">
            {" "}
            Admin Panel<sup></sup>
          </div>
        </Link>

        {/* <!-- Divider --> */}
        <hr className="sidebar-divider my-0" />

        {/* <!-- Nav Item - Dashboard --> */}
        <li className="nav-item active">
          <Link to="/admin/dashboard" className="nav-link">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/" target="_blank" className="nav-link">
            <i class="fa-solid fa-house"></i>
            <span>Home Page</span>
          </Link>
        </li>


        <li className="nav-item">
          <Link to="/" target="_blank" className="nav-link">
            <i class="fa-solid fa-house"></i>
            <span>Home</span>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Sidebar;
