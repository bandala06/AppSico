import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hook/useForm';
import clienteAxios from '../api/clienteAxios'; // <-- Importación corregida
import registro from '../assets/registro.png';

export const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const { formValues, onInputChange, resetForm } = useForm({
    no_control: '', nombre: '', apellido: '', sexo: '', edad: '',
    estado_civil: '', direccion: '', telefono: '', ingenieria: '',
    modalidad: '', semestre: '', fecha_registro: '', email: '',
    password: '', rol: 'usuario',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // <-- Uso limpio de clienteAxios sin la IP quemada
      const response = await clienteAxios.post('/api/users/register', formValues);
      
      if (response.data.success) {
        console.log('Usuario registrado:', response.data);
        navigate('/agenda', {
          replace: true,
          state: {
            logged: true,
            name: formValues.nombre,
          },
        });
        resetForm();
      } else {
        setError(response.data.message || 'Error al registrar el usuario.');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      
      if (error.response) {
        setError(error.response.data.message || 'Error del servidor');
      } else if (error.request) {
        setError('No se pudo conectar con el servidor.');
      } else {
        setError('Error de red. Verifica tu conexión.');
      }
    }
  };

  const formFields = [
    { label: 'Nombre', type: 'text', name: 'nombre', required: true },
    { label: 'Apellido', type: 'text', name: 'apellido', required: true },
    {
      label: 'Sexo', type: 'select', name: 'sexo',
      options: [
        { value: '', label: 'Selecciona una opcion' },
        { value: 'masculino', label: 'Masculino' },
        { value: 'femenino', label: 'Femenino' },
        { value: 'otro', label: 'Otro' },
      ], required: true,
    },
    { label: 'Edad', type: 'number', name: 'edad', required: true, min: 0 },
    {
      label: 'Estado Civil', type: 'select', name: 'estado_civil',
      options: [
        { value: '', label: 'Selecciona una opcion' },
        { value: 'soltero', label: 'Soltero' },
        { value: 'casado', label: 'Casado' },
      ], required: true,
    },
    { label: 'Direccion', type: 'text', name: 'direccion', required: true },
    { label: 'Telefono', type: 'tel', name: 'telefono', required: true, pattern: '[0-9]{10}', title: 'El numero debe contener exactamente 10 digitos.' },
    { label: 'No. Control', type: 'text', name: 'no_control', required: true },
    {
      label: 'Ingenieria', type: 'select', name: 'ingenieria',
      options: [
        { value: '', label: 'Selecciona una opcion' },
        { value: 'isc', label: 'Ing. en Sistemas Computacionales' },
        { value: 'iem', label: 'Ing. en Electromecanica' },
        { value: 'iia', label: 'Ing. en Innovacion Agricola Sustentable' },
        { value: 'isa', label: 'Ing. en Sistemas Automotrices' },
        { value: 'iias', label: 'Ing. en Industrias Alimentarias' },
        { value: 'ige', label: 'Ing. en Gestion Empresarial' },
        { value: 'id', label: 'Ing. Industrial' },
      ], required: true,
    },
    {
      label: 'Modalidad', type: 'select', name: 'modalidad',
      options: [
        { value: '', label: 'Selecciona una opcion' },
        { value: 'escolarizado', label: 'Escolarizado' },
        { value: 'sabatino', label: 'Sabatino' },
      ], required: true,
    },
    { label: 'Semestre', type: 'number', name: 'semestre', required: true, min: 1, max: 12 },
    { label: 'Fecha de Registro', type: 'date', name: 'fecha_registro', required: true },
    { label: 'Email', type: 'email', name: 'email', required: true },
    { label: 'Contraseña', type: 'password', name: 'password', required: true },
  ];

  return (
    <div className='formsign'>
      <form className='signform' onSubmit={handleSubmit}>
        <hr className="full-width" />
        <h1 className="full-width">Registrate</h1>

        {formFields.map((field) => (
          <div className="input-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}:</label>
            {field.type !== 'select' ? (
              <input
                type={field.type} name={field.name} id={field.name} value={formValues[field.name]}
                onChange={onInputChange} required={field.required} min={field.min} max={field.max}
                pattern={field.pattern} title={field.title} autoComplete="off"
              />
            ) : (
              <select name={field.name} id={field.name} value={formValues[field.name]} onChange={onInputChange} required={field.required}>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            )}
          </div>
        ))}

        <button className="full-width" type="submit">Registrarse</button>
        <hr className="full-width" />
        
        {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
      </form>

      <div className='imagesign'>
        <div>
          <img src={registro} alt="Registro" />
        </div>
      </div>
    </div>
  );
};