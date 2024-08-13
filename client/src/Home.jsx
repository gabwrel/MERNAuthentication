import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, ImageRun } from 'docx';


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

  const fetchImageAsBase64 = async (url) => {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const base64 = btoa(
        new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };
  
  

  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Employee List", 14, 22);
  
    const tableColumn = ["Profile Image", "Name", "Email", "Age"];
    const tableRows = [];
  
    for (const user of users) {
      let imageData = null;
      if (user.profileImage) {
        const imageUrl = `http://localhost:3001/uploads/${user.profileImage}`;
        imageData = await fetchImageAsBase64(imageUrl);
      }
  
      tableRows.push([
        { content: imageData ? { image: imageData, width: 20, height: 20 } : "No Image", styles: { halign: 'center', valign: 'middle' } },
        user.name,
        user.email,
        user.age.toString(),
      ]);
    }
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      columnStyles: {
        0: { cellWidth: 30, cellPadding: 3, valign: 'middle' },
        1: { cellWidth: 50 },
        2: { cellWidth: 70 },
        3: { cellWidth: 20 },
      },
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 0 && data.cell.raw.image) {
          doc.addImage(data.cell.raw.image, 'PNG', data.cell.x + 5, data.cell.y + 2, 20, 20);
        }
      }
    });
  
    const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    doc.save(`employee_list-${date}.pdf`);
  };
  

  const generateWordDocument = async () => {
    const tableRows = [];
  
    for (const user of users) {
      let imageRun;
      if (user.profileImage) {
        const imageUrl = `http://localhost:3001/uploads/${user.profileImage}`;
        const imageData = await fetch(imageUrl)
          .then(response => response.arrayBuffer())
          .catch(error => {
            console.error("Error fetching image:", error);
            return null;
          });
  
        if (imageData) {
          imageRun = new ImageRun({
            data: imageData,
            transformation: { width: 40, height: 40 }
          });
        }
      }
  
      const cells = [
        new TableCell({
          children: [imageRun ? imageRun : new Paragraph("No Image")],
          width: { size: 20, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph(user.name)],
          width: { size: 30, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph(user.email)],
          width: { size: 30, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph(user.age.toString())],
          width: { size: 20, type: WidthType.PERCENTAGE }
        })
      ];
  
      tableRows.push(new TableRow({ children: cells }));
    }
  
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: "Employee List",
            heading: "Heading1",
            spacing: { after: 200 }
          }),
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE }
          })
        ]
      }]
    });
  
    try {
      const blob = await Packer.toBlob(doc);
      const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
      saveAs(blob, `employee_list-${date}.docx`);
    } catch (error) {
      console.error("Error generating Word document:", error);
    }
  };
  
  

  return (
    <div className='bg-primary p-4 vh-100'>
      <div className='container rounded p-4 bg-white h-100'>
        <div className='d-flex justify-content-between mb-2'>
          <h1>Welcome {userName}</h1>
          <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
        </div>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h2>Employee List</h2>
          <div>
            <Link to="/create" className='btn btn-success me-2'>Add +</Link>
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
          <button className='btn btn-primary me-2' onClick={generateWordDocument}>Export to Word</button>
          <button className='btn btn-primary' onClick={generatePDF}>Export to PDF</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
