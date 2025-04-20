import axios from 'axios';
import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import "./Navbar.css";



const Navbar = () => {

  const history = useHistory();


  //----------HOOKS----------
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);

  // Get user
  const [user, setUser] = useState("");
  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
    axios.get("/api/me").then((response) => {
      setUser(response.data.user);
    });
  }
  }, []);


  //----------FORM SUBMISSION----------
  // Logout here
  const logoutSubmit = (e) => {
    e.preventDefault(); 
    // Btn Start loading
    setIsLoadingBtn(true);

    axios.post("/api/logout").then((res) => {
      setIsLoadingBtn(false);
      if (res.data.status === 200) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_name");
        swal("Success", res.data.message, "success");
        history.push("/");
      }
    });
  };

  return <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img  className="d-inline-block align-text-top me-2" height="40" src="assets\images\logo.png" width="40" />
          <span className="fw-bold fs-4">
            Student-Registration
          </span>
        </a>
        <button aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler" data-bs-target="#navbarNavDropdown" data-bs-toggle="collapse" type="button">
          <span className="navbar-toggler-icon">
          </span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
          <ul className="navbar-nav align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link link" to="/"><b>Home</b></Link>
            </li>

            {!localStorage.getItem("auth_token") ? (
              <>
                <li className="nav-item ms-lg-3">
                  <Link className="link" to="/login">Login</Link>
                </li>

                <li className="nav-item ms-lg-3">
                  <Link className="link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <a aria-expanded="false" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" id="servicesDropdown" role="button">
                    <b>{user.full_name}</b> 
                  </a>
                  <ul aria-labelledby="servicesDropdown" className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/profile">Profile</Link>
                    </li>
                    <li>
                    <li>
                      <Link className="dropdown-item" to={`edit-profile/${user.id}`}>Edit Profile</Link>
                    </li>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                          <input type="button" className='btn_logout' value={isLoadingBtn ? "Logging out..." : "Logout"} onClick={logoutSubmit} disabled={isLoadingBtn} />
                      </a>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  </>;
};

export default Navbar;
