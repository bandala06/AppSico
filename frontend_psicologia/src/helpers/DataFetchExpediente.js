import clienteAxios from '../api/clienteAxios';

export const fetchExpedienteData = async (noControl, forForm = false) => {
  try {
    const response = await clienteAxios.get(`/api/expediente/${noControl}`);
    const data = response.data;
  
    if (forForm) {
      if (!data.success || !data.usuario) {
        return null;
      }
      
      return {
        no_control: data.usuario.no_control,
        nombre: `${data.usuario.nombre} ${data.usuario.apellido || ''}`.trim(),
        sexo: data.usuario.sexo || '',
        edad: data.usuario.edad || '',
        estado_civil: data.usuario.estado_civil || '',
        direccion: data.usuario.direccion || '',
        telefono: data.usuario.telefono || '',
        ingenieria: data.usuario.ingenieria || '',
        modalidad: data.usuario.modalidad || '',
        semestre: data.usuario.semestre || '',
        fecha_registro: data.usuario.fecha_registro || '',
        email: data.usuario.email || '',
        motivo_consulta: data.expediente ? data.expediente.motivo_consulta : '',
        desencadenantes_motivo: data.expediente ? data.expediente.desencadenantes_motivo : '',
        plan_orientacion: data.expediente ? data.expediente.plan_orientacion : '',
        seguimiento: data.expediente ? data.expediente.seguimiento : '',
        numero_sesiones: data.expediente ? data.expediente.numero_sesiones : '',
      };
    }
    
    return data;

  } catch (error) {
    console.error('Error en la búsqueda:', error);
    
    // Axios arroja error en estados 4xx y 5xx, lo capturamos aquí:
    if (error.response && error.response.status === 404) {
       if (forForm) return null;
       return {
         success: false,
         message: 'Usuario no encontrado',
         usuario: null,
         expediente: null
       };
    }
    
    if (forForm) {
      return null;
    } else {
      return {
        success: false,
        message: 'Error de conexión con el servidor',
        usuario: null,
        expediente: null
      };
    }
  }
};