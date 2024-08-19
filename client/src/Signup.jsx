import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function Signup() {
    const [fname, setfName] = useState('');
    const [lname, setlName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const result = await axios.post('https://employee-list-server.vercel.app/register', {
            fname,
            lname,
            email,
            password,
        });
        console.log(result);
        navigate('/login');
    } catch (err) {
        if (err.response) {
            // The request was made, and the server responded with a status code outside the range of 2xx
            console.log('Error Response:', err.response.data);
            console.log('Error Status:', err.response.status);
        } else if (err.request) {
            // The request was made, but no response was received
            console.log('Error Request:', err.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error Message:', err.message);
        }
    }
};


    return (
        <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
            <div className='bg-white p-3 rounded w-50'>
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="fname">
                            <strong>First Name</strong>
                        </label>
                        <input 
                            type="text"
                            placeholder='Enter First Name'
                            autoComplete='off'
                            name='fname'
                            className='form-control rounded-0' 
                            value={fname}
                            onChange={(e) => setfName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lname">
                            <strong>Last Name</strong>
                        </label>
                        <input 
                            type="text"
                            placeholder='Enter Last Name'
                            autoComplete='off'
                            name='lname'
                            className='form-control rounded-0' 
                            value={lname}
                            onChange={(e) => setlName(e.target.value)} />
                    </div>
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
                            onChange={(e) => setEmail(e.target.value)} />
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
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'>
                        Register
                    </button>
                </form> 
                <p className='text-center'>Already Have an Account? <Link to='/login'>Login</Link></p>
            </div>
        </div>
    );
}

export default Signup;
