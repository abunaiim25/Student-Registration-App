import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Registration from './components/auth/Register/Registration';
import axios from "axios";
import Login from './components/auth/Login/Login';
import Page403 from './components/Error/Page403';
import Page404 from './components/Error/Page404';
import AdminPrivateRoute from './routes_items/AdminPrivateRoute';
import FrontendPublicRoute from './routes_items/FrontendPublicRoute';

function App() {
  //===================== (Laravel API)===============================
  axios.defaults.baseURL = "http://127.0.0.1:8000/";
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.post['Accept'] = 'application/json';
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('auth_token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  });
  //===================== (Laravel API)===============================

  return (
    <div className="App">
      <Router>
        <Switch>

          {/** Auth */}
          <Route exact path={"/register"} component={Registration} />
          <Route exact path={"/login"} component={Login} />

          {/** Not Found, Error */}
          <Route path={"/403"} component={Page403} />
          <Route path={"/404"} component={Page404} />

          {/** Admin Panel */}
          <AdminPrivateRoute path='/admin' name="Admin" />  {/** 1 */}

          {/** Frontend */}
          <FrontendPublicRoute path='/' name="Home" /> {/** 1 */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
