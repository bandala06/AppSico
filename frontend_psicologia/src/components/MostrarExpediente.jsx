import React, { useState } from 'react';
import { fetchExpedienteData } from '../helpers/DataFetchExpediente';
import { ListarExpediente } from './ListarExpediente';
import { CircleAnimation } from './UI/CircleAnimation';

export const MostrarExpediente = () => {
  const [numeroControl, setNumeroControl] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sincronizar edición localmente para que la UI se actualice tras guardar
  const handleEditExpediente = (updatedExpediente) => {
    setResultado((prev) => ({
      ...prev,
      expediente: updatedExpediente
    }));
  };

  // Sincronizar eliminación localmente
  const handleDeleteExpediente = () => {
    setResultado((prev) => ({
      ...prev,
      expediente: null
    }));
  };

  const handleSearch = async () => {
    if (!numeroControl.trim()) {
      setError('Ingresa un número de control');
      return;
    }

    // REINICIO TOTAL DE ESTADOS
    setLoading(true);
    setError('');       // Borra el mensaje rojo de "Usuario no encontrado"
    setResultado(null);  // Limpia la pantalla

    try {
      const data = await fetchExpedienteData(numeroControl);

      // Verificamos si la respuesta del servidor es exitosa
      if (data && data.success && data.usuario) {
        setResultado(data);
        console.log("Usuario encontrado:", data.usuario.nombre);
      } else {
        // Si el servidor responde pero no hay datos
        setError('El usuario no existe en la base de datos');
      }
    } catch (err) {
      // Si hay un error 401 (Unauthorized) o 404 (Not Found)
      console.error("Error técnico:", err);
      setError(`Error de conexión: ${err.response?.status === 401 ? 'Sesión expirada' : 'Servidor no responde'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="layout-expediente">
      <div className="search-container formhablemos formhablemos2">
        <input
          type="text"
          placeholder="Número de Control"
          value={numeroControl}
          onChange={(e) => setNumeroControl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {loading && <CircleAnimation />}
      {error && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {resultado && resultado.usuario && (
        <div className='result-search'>
          <div className="result-container">
            <h3>Resultado:</h3>
            {/* Acceso corregido según el modelo de la BD */}
            <p><strong>Número de Control:</strong> {resultado.usuario.no_control}</p>
            <p><strong>Nombre:</strong> {resultado.usuario.nombre} {resultado.usuario.apellido}</p>
            <p><strong>Carrera:</strong> {resultado.usuario.ingenieria || 'No especificada'}</p>
            <p><strong>Semestre:</strong> {resultado.usuario.semestre || 'N/A'}</p>
          </div>

          <div className="expedientes-list">
            {/* El backend envía 'expediente' como objeto único por no_control */}
            {resultado.expediente ? (
              <ListarExpediente
                expediente={resultado.expediente}
                paciente={resultado.usuario}
                onEdit={handleEditExpediente}
                onDelete={handleDeleteExpediente}
              />
            ) : (
              <div className="no-expediente-msg" style={{ padding: '20px', backgroundColor: '#fdf2f2', borderRadius: '8px' }}>
                <p>El usuario existe pero <strong>no tiene un historial clínico</strong> registrado aún.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};