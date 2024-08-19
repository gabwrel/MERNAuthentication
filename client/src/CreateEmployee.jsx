import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateEmployee() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');

    const handleImageChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const submitForm = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('age', age);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }
        axios.post('https://employee-list-server.vercel.app/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` // Ensure the token is correct
            }
        })
        .then(result => {
            console.log(result);
            navigate('/home');
        })
        .catch(err => console.log(err));
    };
    

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-75 bg-white rounded p-3'>
                <form onSubmit={submitForm}>
                    <h2>Add User</h2>
                    <div className="mb-2">
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder='Enter Name' 
                            className='form-control' 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder='Enter Email' 
                            className='form-control' 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="age">Age</label>
                        <input 
                            type="text" 
                            id="age" 
                            placeholder='Enter Age' 
                            className='form-control' 
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="profileImage">Profile Image</label>
                        <input 
                            type="file" 
                            id="profileImage" 
                            className='form-control' 
                            onChange={handleImageChange}
                        />
                    </div>
                    <button className='btn btn-success' type='submit'>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default CreateEmployee;
