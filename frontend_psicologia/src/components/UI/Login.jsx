import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/clienteAxios'; // <-- Importación corregida

import { InputField } from '../common/InputField';
import { ErrorMessage } from '../common/ErrorMessage';
import inicio from '../../assets/inicio.png';

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState('user');

  useEffect(() => {
    const role = localStorage.getItem('role');
    const noControl = localStorage.getItem('no_control');
    if (role && noControl) {
      navigate('/agenda', { replace: true });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { email, password } = formData;
      
      // <-- Rutas limpias relativas a tu clienteAxios
      const url = userType === 'admin'
        ? '/api/admin/loginAdmin'
        : '/api/users/login';

      const response = await clienteAxios.post(url, { email, password });
      console.log('Respuesta de la API:', response.data);

      if (response.data?.success) {
        const userData = response.data.user;

        if (userData && userData.rol) {
          localStorage.setItem('role', userData.rol);
          localStorage.setItem('no_control', userData.id);

          navigate('/agenda', {
            replace: true,
            state: {
              logged: true,
              email: userData.email || 'No disponible',
            },
          });
        } else {
          setError('Error: El backend no devolvió los datos del usuario completos.');
        }
      } else {
        setError(response.data?.message || 'Credenciales incorrectas.');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Error en el servidor.');
      } else {
        setError('Error de red. Verifique la conexión con el servidor.');
      }
      console.error(err);
    }
  };

  return (
    <div className="formsign">
      <div className='imagesign'>
        <div>
          <img src={inicio} alt="Inicio" />
        </div>
      </div>
      <form className='signform signform2' onSubmit={onLogin}>
        <hr />
        <h1>Iniciar Sesión</h1>

        <div className='signformsel'>
          <label>
            <input
              type="radio"
              value="user"
              checked={userType === 'user'}
              onChange={handleUserTypeChange}
            />
            Usuario
          </label>
          <label>
            <input
              type="radio"
              value="admin"
              checked={userType === 'admin'}
              onChange={handleUserTypeChange}
            />
            Administrador
          </label>
        </div>

        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />

        <ErrorMessage message={error} />
        <div className='gridbutton'>
          <button className="full-width" type="submit">Iniciar Sesión</button>
        </div>
        <hr />
      </form>
    </div>
  );
};