import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://employee-list-api.vercel.app/login', { email, password });

      if (response.data.success) {
        const token = response.data.accessToken;
        localStorage.setItem('accessToken', token);

        // Decode the token to get user info
        const decodedToken = jwtDecode(token);
        localStorage.setItem('userName', decodedToken.name);

        navigate('/home');
      } else {
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('An error occurred during login:', error.response?.data || error.message);
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
      <div className='bg-white p-3 rounded w-50'>
        <h2 className='text-center text-uppercase'>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder='Enter Email'
              autoComplete='off'
              name='email'
              className='form-control rounded-0'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder='Enter Password'
              autoComplete='off'
              name='password'
              className='form-control rounded-0'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0'>
            Login
          </button>
        </form>
        <p className='text-center'>Don't have an account? <Link to='/register'>Click here</Link></p>
      </div>
    </div>
  );
}

export default Login;
