import React from "react";
import './error.css'

const Page404 = () => {
  return (
    <>
     <div className="notfound-container">
      <div className="notfound">
        <h1 className="notfound-title">404!</h1>
        <p className="notfound-text"> Page Not Found & Error Page</p>
        <p className="notfound-text">Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className="notfound-btn">Go Home</a>
      </div>
    </div>
    </>
  );
};

export default Page404;
