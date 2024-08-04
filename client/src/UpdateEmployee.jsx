import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

function UpdateEmployee() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [picture, setPicture] = useState(null); // State for the new image file
    const [currentImage, setCurrentImage] = useState(''); // State for the current image URL
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken'); // Get the token from local storage

    useEffect(() => {
        // Fetch employee data by ID
        axios.get(`http://localhost:3001/getEmployee/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const employee = response.data.employee;
            setName(employee.name); // Set the employee name
            setEmail(employee.email);
            setAge(employee.age);
            setCurrentImage(employee.picture); // Set the current image URL
        })
        .catch(error => console.error('Error fetching employee:', error));
    }, [id, token]);

    const handleImageChange = (e) => {
        setPicture(e.target.files[0]); // Get the selected file
    };

    const handleRemoveImage = () => {
        axios.delete(`http://localhost:3001/home/${id}`, { removeImage: true }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(result => {
            setCurrentImage(''); // Clear the current image URL
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
            formData.append('profileImage', picture); // Append the new image file
        }
        
        axios.put(`http://localhost:3001/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(result => {
            // After a successful update, set the new image URL (if available)
            if (result.data.employee.picture) {
                setCurrentImage(result.data.employee.picture);
            }
            console.log(result);
            navigate('/home'); // Redirect to home or the updated employee list
        })
        .catch(err => console.log(err));
    };

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-75 bg-white rounded p-3'>
                <form onSubmit={updateEmployee}>
                    <h2>Update Employee</h2>
                    <div className="mb-2">
                        <label htmlFor="lname">Name</label>
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
                        <label htmlFor="lname">Email</label>
                        <input 
                            type="text" 
                            id="email" 
                            placeholder='Enter Email' 
                            className='form-control' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="lname">Age</label>
                        <input 
                            type="text" 
                            id="lname" 
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
