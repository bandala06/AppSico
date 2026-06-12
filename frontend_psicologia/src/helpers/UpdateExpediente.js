import clienteAxios from '../api/clienteAxios';

export const updateExpediente = async (id, expedienteData) => {
  try {
    const response = await clienteAxios.put(`/api/expediente/${id}`, expedienteData);
    
    console.log('Expediente actualizado con éxito:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el expediente:', error);
    throw error;
  }
};