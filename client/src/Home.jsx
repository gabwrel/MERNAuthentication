import React from 'react';
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); 
    localStorage.removeItem('userName');
    navigate('/login');
};

  const token = localStorage.getItem('accessToken');
  let userName = "Guest";

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userName = `${decodedToken.fname}`;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return (
    <div className='bg-primary p-4 vh-100'>
      <div className='container rounded p-4 bg-white h-100'>
        <h1>Welcome {userName} the Real Nigga!</h1>
        <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Home;
