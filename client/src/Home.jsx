import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generatePDF, PitoyNiOwie } from './constants';

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

  const generatePDF = () => {
    const input = document.getElementById('employeeTable');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, heightLeft - imgHeight, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('employee_list.pdf');
    });
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/home', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(result => {
      setUsers(result.data.employees);
    })
    .catch(err => console.log(err));
  }, [token]);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/home/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setUsers(users.filter(user => user._id !== id));
    })
    .catch(err => console.log(err));
  };

  

  return (
    <div className='bg-primary p-4 vh-100'>
      <div className='container rounded p-4 bg-white h-100'>
        <div className='d-flex justify-content-between mb-2'>
          <h1>Welcome <PitoyNiOwie uroy="tamod"/></h1>
          
          <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
        </div>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h2>Employee List</h2>
          <div>
            <Link to="/create" className='btn btn-success me-2'>Add +</Link>
            <button className='btn btn-primary' onClick={generatePDF}>Generate PDF</button>
          </div>
        </div>
        <div id="employeeTable">
          <table className='table table-striped'>
            <thead>
              <tr>
                <th>Profile Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    {user.profileImage ? (
                      <img 
                        src={`http://localhost:3001/uploads/${user.profileImage}`} 
                        // src={user.profileImage}
                        alt={user.name} 
                        className='img-thumbnail' 
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className='bg-secondary text-white d-flex align-items-center justify-content-center' style={{ width: '100px', height: '100px' }}>
                        <span>No Image</span>
                      </div>
                    )}
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.age}</td>
                  <td>
                    <Link to={`/update/${user._id}`} className='btn btn-success me-2'>Update</Link>
                    <button className='btn btn-danger' onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
