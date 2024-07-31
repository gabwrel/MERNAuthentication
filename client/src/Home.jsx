import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    }

  return (
    <div className='bg-primary vh-100 w-100'>
        <h1>Home</h1>
        <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home