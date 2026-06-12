import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const RutasPrivadas = () => {
    // Ya no buscamos el 'token', ahora buscamos el 'role'
    const role = localStorage.getItem('role');

    // Si hay un rol, lo dejamos pasar. Si no, lo regresamos al login.
    return role ? <Outlet /> : <Navigate to="/login" replace />;
};