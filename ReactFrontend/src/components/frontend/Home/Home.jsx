import React from 'react';

const Home = () => {
  document.title = "Home";

  return (
    <div style={{
        backgroundImage: "url('/assets/images/home.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "80vh", // full screen height
    }}>
      
    </div>
  )
}
export default Home
