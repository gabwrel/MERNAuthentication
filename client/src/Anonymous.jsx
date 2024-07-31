import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

function Anonymous() {
    const token = localStorage.getItem('accessToken');

    return token ? <Navigate to="/home" replace /> : <Outlet />;
}

export default Anonymous;
