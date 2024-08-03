import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import PrivateRoute from './PrivateRoute';
import Anonymous from './Anonymous';
import CreateEmployee from './CreateEmployee';
import UpdateEmployee from './UpdateEmployee';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes that should only be accessible when not authenticated */}
        <Route element={<Anonymous />}>
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>
        
        {/* Routes that should only be accessible when authenticated */}
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/create" element={<PrivateRoute element={<CreateEmployee />} />} />
        <Route path="/update/:id" element={<PrivateRoute element={<UpdateEmployee />} />} /> {/* Corrected path */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
