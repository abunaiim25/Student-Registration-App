import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


const Dashboard = () => {
  document.title = "Admin";

  const [allUser, setAllUser] = useState("");

  useEffect(() => {
    axios.get("/api/getAllUser").then((response) => {
      setAllUser(response.data.all_user);
    });
  }, []);



  return (
    <>

      <div className="container mt-4">
        <h2 className="mb-3">All Users</h2>
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              {/* Add more columns if needed */}
            </tr>
          </thead>
          <tbody>
            {allUser.length > 0 ? (
              allUser.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{user.role_as == 1 ? "Admin" : "User"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Dashboard