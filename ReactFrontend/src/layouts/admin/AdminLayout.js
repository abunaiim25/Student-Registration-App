/** 3 */
import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AdminRouteList from "../../routes/AdminRouteList"; //Router -> MasterLayout -> App
import Sidebar from "./include/Sidebar";
import Navbar from "./include/Navbar";
import Footer from "./include/Footer";

const AdminLayout = () => {
  return (
    <>
      <div id="wrapper">
        <Sidebar />
  
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Navbar />
            
            <div className="container-fluid">

              {/* Pages-> Main Content */}
              <div>
                <Switch>
                  {AdminRouteList.map((route, index) => {
                    return (
                      route.component && (
                        <Route
                          key={index}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={(props) => <route.component {...props} />}
                        />
                      )
                    );
                  })}
                  <Redirect from="/admin" to="/admin/dashboard" />
                  {/** when search /admin, go to  /admin/dashboard*/}
                </Switch>
              </div>


            </div>
          </div>
          <Footer />
        </div>
      </div>


      {/* <!-- Scroll to Top Button--> */}
      <a className="scroll-to-top rounded" href="#page-top">
        <i className="fas fa-angle-up"></i>
      </a>
    </>
  );
};

export default AdminLayout;
