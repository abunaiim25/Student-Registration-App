/** 2 */
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Redirect, Route, useHistory } from "react-router-dom";
import swal from "sweetalert";
import AdminLayout from "../layouts/admin/AdminLayout";
//loading =>  //npm install --save react-spinners //https://www.npmjs.com/package/react-spinners
import Loader from "react-spinners/ClipLoader";

function AdminPrivateRoute({ ...rest }) {
  const history = useHistory();
  const [Authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); //Loading 3

  //after login you can enter in admin panel
  useEffect(() => {
        axios.get(`/api/checkingAuthenticated`).then((res) => {
            if (res.status === 200) {
              setAuthenticated(true);
            }
            setLoading(false); //Loading 3
          });
          return () => {
            setAuthenticated(false);
          };
  }, []);



  //without login, if anyone want to go admin panel, they see blank page or 401 error. for that we write this code.
  axios.interceptors.response.use(
    undefined,
    function axiosRetryInterceptor(err) {
        if (err.response.status === 401) {
          //swal("No One Can Enter Without Admin ", err.response.data.message, "warning");
          swal(
            "Unauthenticated, Login First",
            "No One Can Enter Without Admin",
            "warning"
          );
          history.push("/login");
          console.log(err.response.data);
        }
        return Promise.reject(err);
    }
    // .catch(e => {
    //     console.log(e.message);
    // })
  );

  //when user go to admin page, then redirect these page
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 403) {
        //Access Denied
        swal("Forbidden", error.response.data.message, "warning");
        history.push("/403");
      } else if (error.response.status === 404) {
        //Page Not Found
        swal("404 Error", "Url/Page Not Found", "warning");
        history.push("/404");
      }
      return Promise.reject(error);
    }
  );

  if (loading) {
    //Loading 3
    //npm install --save react-spinners
    return (
      <div className="loader_loading">
        <Loader color={"36D7B7"} loading={loading} size={80} />
        <h1>Loading....</h1>
      </div>
    );
  }

  return (
    <>
      <Route
        {...rest}
        render={
          ({ props, location }) =>
            Authenticated ? (
              <AdminLayout {...props} />
            ) : (
              <Redirect
                to={{ pathname: "/login", state: { from: location } }}
              />
            ) //when user want to go admin page, then login page came here
        }
      />
    </>
  );
}

export default AdminPrivateRoute;
