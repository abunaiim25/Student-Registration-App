import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { PUBLIC_URL } from "../../../PUBLIC_URL";
import { Link } from 'react-router-dom';


const Profile = () => {
  document.title = "Profile";

  //----------HOOKS----------
  // Get user
  const [user, setUser] = useState("");
  const [academicInfo, setAcademicInfo] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
      axios.get("/api/me").then((response) => {
        setUser(response.data.user);
        setAcademicInfo(response.data.user.academic_infos);
      });
    }
  }, []);
  if (!user) return <p>Loading...</p>;


  return (
    <div className="container my-4">
      <div className="card shadow overflow-hidden">
        <div className="position-relative" style={{ height: "300px", overflow: "hidden" }}>
          <img
            src="/assets/images/profile.jpg"
            alt="Cityscape at sunset"
            className="w-100 h-100 object-fit-cover"
          />
          <div className="position-absolute bottom-0 start-0 translate-middle-y ms-4">
            <img
              src={`${PUBLIC_URL}/img_DB/images/${user.image}`}
              alt="Profile"
              className="rounded-circle border border-4 border-white"
              style={{ width: "128px", height: "128px", objectFit: "cover" }}
            />
          </div>
        </div>

        <div className="card-body ">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
            <div>
              <h6 className="text-muted"><b>@{user.full_name}</b></h6>
              <h6 className="text-muted">Date of birth {user.dob}</h6>
              <p className="text-muted mb-1">
                <i className="fas fa-map-marker-alt me-2"></i>
                {user.city}, {user.country}
              </p>
              <p className="text-muted">
                <i className="fas fa-envelope me-2"></i>
                <a href={`mailto:${user.email}`} className="text-decoration-none text-primary">
                  {user.email}
                </a>
              </p>
            </div>
            <div className="mt-4 mt-md-0">
              <Link className='link' to={`edit-profile/${user.id}`}>Edit Profile</Link>
            </div>
          </div>

          <hr className="my-4" />


          <div className="row">
            <div className="col-md-6">
              <section>
                <h3 className="h5">Education</h3>
                <div className="mt-3">
                  {academicInfo.map((info, index) => (
                    <div key={index} className="border-start border-4 border-success ps-3 mb-3">
                      <h5 className="mb-1">{info.examination}</h5>
                      <strong className="text-success">Subject: {info.group}</strong><br />
                      <strong className="text-success">Result: {info.result}</strong>
                      <p className="text-muted">Passing Year: {info.passing}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="col-md-6">
              <section className="mb-4">
                <h3 className="h5">My Address</h3>
                <div className="mt-3">
                  <div className="border-start border-4 border-primary ps-3 mb-4">
                    <h5 className="mb-1">Street: {user.street}</h5>
                    <strong className="text-primary">City: {user.city}</strong>
                    <p className="text-muted mb-1">State: {user.state}</p>
                    <p className="text-muted mb-1">Zip: {user.zip}</p>
                    <p>Country: {user.country}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
