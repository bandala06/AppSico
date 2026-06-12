import React, { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { ExpedientePDF } from './pdf/ExpedientePDF';
import clienteAxios from '../../api/clienteAxios'; // <-- Importación añadida
import '../themes/FormExpediente.css';

export const Expediente = () => {
  const initialFormData = {
    no_control: '', nombre: '', sexo: '', edad: '', estado_civil: '',
    direccion: '', telefono: '', ingenieria: '', modalidad: '', semestre: '',
    fecha_registro: '', motivo_consulta: '', desencadenantes_motivo: '',
    plan_orientacion: '', seguimiento: '', numero_sesiones: '',
  };

  const [formData, setFormData] = useState(initialFormData);

 const fetchUserData = async (noControl) => {
  try {
    // <-- fetch cambiado por clienteAxios
    const response = await clienteAxios.get(`/api/expediente/${noControl}`);
    const data = response.data; // Axios ya formatea el JSON

    if (data.success && data.usuario) {
      const exp = data.expediente; 

      setFormData((prevData) => ({
        ...prevData,
        nombre: `${data.usuario.nombre} ${data.usuario.apellido || ''}`,
        sexo: data.usuario.sexo || '', edad: data.usuario.edad || '',
        estado_civil: data.usuario.estado_civil || '', direccion: data.usuario.direccion || '',
        telefono: data.usuario.telefono || '', ingenieria: data.usuario.ingenieria || '',
        modalidad: data.usuario.modalidad || '', semestre: data.usuario.semestre || '',
        
        motivo_consulta: exp ? exp.motivo_consulta : '',
        desencadenantes_motivo: exp ? exp.desencadenantes_motivo : '',
        plan_orientacion: exp ? exp.plan_orientacion : '',
        seguimiento: exp ? exp.seguimiento : '',
        numero_sesiones: exp ? exp.numero_sesiones : '',
      }));
    } else {
      setFormData(prev => ({ ...initialFormData, no_control: noControl }));
    }
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
};

  useEffect(() => {
    if (formData.no_control.length >= 8) {
      fetchUserData(formData.no_control);
    }
  }, [formData.no_control]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // <-- Método POST simplificado gracias a Axios
      const response = await clienteAxios.post('/api/expediente', formData);
      const result = response.data;

      // Status 200 o 201 en Axios indica éxito
      if (response.status === 200 || response.status === 201) {
        const datosParaPDF = {
          paciente: {
            nombre: formData.nombre || 'No registrado',
            numeroControl: formData.no_control,
            carrera: formData.ingenieria,
            semestre: formData.semestre,
            telefono: formData.telefono
          },
          expediente: {
            motivo_consulta: formData.motivo_consulta,
            numero_sesiones: formData.numero_sesiones,
            plan_orientacion: formData.plan_orientacion,
            seguimiento: formData.seguimiento
          }
        };

        const doc = <ExpedientePDF {...datosParaPDF} />;
        const blob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Expediente_${formData.no_control}.pdf`;
        link.click();

        alert("✅ Expediente guardado y PDF generado");
        setFormData(initialFormData);
      } else {
        alert("❌ Error al guardar: " + (result.message || "Error desconocido"));
      }
    } catch (error) {
      console.error('Error en el envío:', error);
      alert("Error de conexión con el servidor");
    }
  };

  const {
    no_control, nombre, sexo, edad, estado_civil, direccion, telefono,
    ingenieria, modalidad, semestre, fecha_registro, motivo_consulta,
    desencadenantes_motivo, plan_orientacion, seguimiento, numero_sesiones
  } = formData;

  return (
    <div className='form-expediente'>
      <form className='formegrid formhablemos formhablemos2' onSubmit={handleSubmit}>
        <div><label>Número de control:</label><input type="text" name="no_control" value={no_control} onChange={handleChange} required /></div>
        <div><label>Nombre y apellidos:</label><input type="text" name="nombre" value={nombre} onChange={handleChange} required /></div>
        <div><label>Sexo:</label><input type="text" name="sexo" value={sexo} onChange={handleChange} required /></div>
        <div><label>Edad:</label><input type="number" name="edad" value={edad} onChange={handleChange} required /></div>
        <div><label>Estado Civil:</label><input type="text" name="estado_civil" value={estado_civil} onChange={handleChange} required /></div>
        <div><label>Dirección:</label><input type="text" name="direccion" value={direccion} onChange={handleChange} required /></div>
        <div><label>Teléfono:</label><input type="tel" name="telefono" value={telefono} onChange={handleChange} required /></div>
        <div><label>Ingeniería:</label><input type="text" name="ingenieria" value={ingenieria} onChange={handleChange} required /></div>
        <div><label>Modalidad:</label><input type="text" name="modalidad" value={modalidad} onChange={handleChange} required /></div>
        <div><label>Semestre:</label><input type="number" name="semestre" value={semestre} onChange={handleChange} required /></div>
        <div><label>Fecha de Registro:</label><input type="date" name="fecha_registro" value={fecha_registro} onChange={handleChange} required /></div>
        <div><label>Motivo de Consulta:</label><input type="text" name="motivo_consulta" value={motivo_consulta} onChange={handleChange} required /></div>
        <div><label>Desencadenantes del Motivo:</label><input type="text" name="desencadenantes_motivo" value={desencadenantes_motivo} onChange={handleChange} required /></div>
        <div><label>Plan de Orientación:</label><input type="text" name="plan_orientacion" value={plan_orientacion} onChange={handleChange} required /></div>
        <div><label>Seguimiento:</label><input type="text" name="seguimiento" value={seguimiento} onChange={handleChange} required /></div>
        <div><label>Número de sesiones:</label><input type="number" name="numero_sesiones" value={numero_sesiones} onChange={handleChange} required min="0" /></div>
        <input type="submit" value="Generar Expediente" />
      </form>
    </div>
  );
};