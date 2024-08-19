import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

function UpdateEmployee() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [picture, setPicture] = useState(null);
    const [currentImage, setCurrentImage] = useState(''); 
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get(`https://employee-list-api.vercel.app/getEmployee/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const employee = response.data.employee;
            setName(employee.name);
            setEmail(employee.email);
            setAge(employee.age);
            setCurrentImage(employee.profileImage ? `https://employee-list-api.vercel.app/uploads/${employee.profileImage}` : ''); 
        })
        .catch(error => console.error('Error fetching employee:', error));
    }, [id, token]);

    const handleImageChange = (e) => {
        setPicture(e.target.files[0]);
    };

    const handleRemoveImage = () => {
        axios.delete(`https://employee-list-api.vercel.app/removeImage/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            setCurrentImage(''); 
        })
        .catch(err => console.log(err));
    };

    const updateEmployee = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('age', age);

        if (picture) {
            formData.append('profileImage', picture);
        }

        axios.put(`https://employee-list-api.vercel.app/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(result => {
            if (result.data.employee.profileImage) {
                setCurrentImage(`https://employee-list-api.vercel.app/uploads/${result.data.employee.profileImage}`);
            }
            navigate('/home');
        })
        .catch(err => console.log(err));
    };

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-75 bg-white rounded p-3'>
                <form onSubmit={updateEmployee}>
                    <h2>Update Employee</h2>
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
                            type="number" 
                            id="age" 
                            placeholder='Enter Age' 
                            className='form-control' 
                            value={age} 
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="profileImage">Profile Image</label>
                        {currentImage && (
                            <div className="mb-2">
                                <img 
                                    src={currentImage} 
                                    alt="Current" 
                                    className='img-thumbnail' 
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                                <div className="mt-2">
                                    <button 
                                        type='button' 
                                        className='btn btn-danger' 
                                        onClick={handleRemoveImage}
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            </div>
                        )}
                        <input 
                            type="file" 
                            id="profileImage" 
                            className='form-control' 
                            onChange={handleImageChange}
                        />
                    </div>
                    <button className='btn btn-success' type='submit'>Update</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateEmployee;
