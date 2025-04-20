import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto" style={{ height: '20vh' }}>
      <div className="container">
        <p className="mb-0">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
        <span className="fw-bold fs-4">
            Student-Registration
          </span>
      </div>
    </footer>
  );
};

export default Footer;
