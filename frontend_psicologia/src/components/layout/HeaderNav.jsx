import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/ITSL_WHITE.png';

export const HeaderNav = () => {
    // Ya no buscamos el token, solo el rol y el no_control para saber si está logueado
    const role = localStorage.getItem('role');
    const isLoggedIn = role !== null; 
    const navigate = useNavigate();

    const onLogout = () => {
        // Limpiamos los datos locales al cerrar sesión
        localStorage.removeItem('role');
        localStorage.removeItem('no_control');
        navigate('/login', { replace: true });
    };

    return (
        <header className="header">
            <div className='barnavtext'>
                <img src={logo} alt="Logo" className='ITSL_WHITE' />
                <NavLink to="/inicio" className={({ isActive }) => (isActive ? 'active' : '')}>INICIO</NavLink>
                <NavLink to="/Info" className={({ isActive }) => (isActive ? 'active' : '')}>CONÓCENOS</NavLink>
                <NavLink to="/Info#Preguntas" className={({ isActive }) => (isActive ? 'active' : '')}>PREGUNTAS FRECUENTES</NavLink>
                <NavLink to="/Servicios" className={({ isActive }) => (isActive ? 'active' : '')}>SERVICIOS</NavLink>
                <NavLink to="/Servicios#Contacto" className={({ isActive }) => (isActive ? 'active' : '')}>CONTACTO</NavLink>
               
                {/* Mostramos Agenda si está logueado */}
                {isLoggedIn && (
                    <NavLink to="/agenda" className={({ isActive }) => (isActive ? 'active' : '')}>AGENDA</NavLink>
                )}

                {/* Mostramos Expedientes solo si es admin */}
                {isLoggedIn && role === 'admin' && (
                    <>
                        <NavLink to="/agenda#Expediente" className={({ isActive }) => (isActive ? 'active' : '')}>EXPEDIENTE</NavLink>
                        <NavLink to="/agenda#MostrarExpediente" className={({ isActive }) => (isActive ? 'active' : '')}>VER EXPEDIENTE</NavLink>
                    </>
                )}
            </div>

            <div className='boton'>
                {!isLoggedIn ? (
                    <>
                        <NavLink id='btn-1' to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>Iniciar Sesión</NavLink>
                        <NavLink id='btn-2' to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>Crear Cuenta</NavLink>
                    </>
                ) : (
                    <button onClick={onLogout}>Cerrar sesión</button>
                )}
            </div>
        </header>
    );
};