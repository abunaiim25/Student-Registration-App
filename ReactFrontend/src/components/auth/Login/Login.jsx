import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

const Login = () => {
    const history = useHistory();
    document.title = "Login";


    //----------HOOKS----------
    const [isLoadingBtn, setIsLoadingBtn] = useState(false);
    const [loginInput, setLogin] = useState({
        email: "",
        password: "",
        error_list: [],
    });


    //----------HANDLE CHANGE----------
    const handleInput = (e) => {
        setLogin({ ...loginInput, [e.target.name]: e.target.value });
    };


    //----------FORM SUBMISSION----------
    const loginSubmit = (e) => {
        e.preventDefault();
        setIsLoadingBtn(true);

        const data = {
            email: loginInput.email,
            password: loginInput.password,
        };

        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`/api/login`, data).then(res => {
                setIsLoadingBtn(false);
                if (res.data.status === 200) {
                    localStorage.setItem('auth_token', res.data.token);
                    localStorage.setItem('auth_name', res.data.full_name);
                    swal("Success", res.data.message, "success");
                    if (res.data.role === 'admin') {
                        history.push('/admin/dashboard');// 
                    }
                    else {
                        history.push('/');// login to home page
                    }
                }
                else if (res.data.status === 401) {
                    swal("Warning", res.data.message, "warning");
                }
                else {
                    setLogin({ ...loginInput, error_list: res.data.validation_errors });
                }
            });
        });
    };


    // Redirect to home page if already logged in
    const [user, setUser] = useState("");
    useEffect(() => {
        if (localStorage.getItem("auth_token")) {
            axios.get("/api/me").then((response) => {
                setUser(response.data.user);
            });
        }
    }, []);
    useEffect(() => {
        if (user) {
            history.push("/");
        }
    }, [user, history]);


    return (
        <div style={{
            backgroundImage: "url('/assets/images/bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "110vh", // full screen height
        }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h3 className="text-center mb-4">Student Login</h3>
                                <form onSubmit={loginSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label" style={{ display: 'flex' }}>Email address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={loginInput.email}
                                            onChange={handleInput}
                                            className="form-control"
                                        />
                                        <small className="text-danger">{loginInput.error_list.email}</small>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label" style={{ display: 'flex' }}>Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={loginInput.password}
                                            onChange={handleInput}
                                            className="form-control"
                                        />
                                        <small className="text-danger">{loginInput.error_list.password}</small>
                                    </div>

                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-success" disabled={isLoadingBtn}>
                                            {isLoadingBtn ? "Please wait..." : "Login"}
                                        </button>
                                    </div>
                                </form>

                                <div className="text-center mt-3">
                                    <span>Don't have an account? </span>
                                    <Link to="/register" className="text-success">Register here</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Login;
