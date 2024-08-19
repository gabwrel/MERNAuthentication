import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (!fname || !lname || !email || !password) {
            setError('All fields are required');
            return;
        }

        try {
            const result = await axios.post('https://employee-list-api.vercel.app/register', {
                fname,
                lname,
                email,
                password,
            });
            console.log(result);
            navigate('/login');
        } catch (err) {
            if (err.response) {
                // Error response from the server
                setError(err.response.data.message || 'An error occurred');
            } else if (err.request) {
                // No response received
                setError('No response from server');
            } else {
                // Error setting up the request
                setError(err.message || 'An error occurred');
            }
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
            <div className='bg-white p-3 rounded w-50'>
                <h2>Register</h2>
                {error && <div className='alert alert-danger'>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="fname">
                            <strong>First Name</strong>
                        </label>
                        <input 
                            type="text"
                            placeholder='Enter First Name'
                            name='fname'
                            className='form-control rounded-0' 
                            value={fname}
                            onChange={(e) => setFName(e.target.value)} 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lname">
                            <strong>Last Name</strong>
                        </label>
                        <input 
                            type="text"
                            placeholder='Enter Last Name'
                            name='lname'
                            className='form-control rounded-0' 
                            value={lname}
                            onChange={(e) => setLName(e.target.value)} 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input 
                            type="email"
                            placeholder='Enter Email'
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
                            name='password'
                            className='form-control rounded-0'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
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
