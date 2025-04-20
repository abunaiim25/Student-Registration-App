import {React, useEffect, useState} from 'react';
import StudentForm from './StudentForm';
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const Registration = () => {
    document.title = "Registration";
    const history = useHistory();

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
            <div className="container mx-auto p-6">
                <StudentForm />
            </div>
        </div>
    )
}

export default Registration
