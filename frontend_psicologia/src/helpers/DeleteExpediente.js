import clienteAxios from '../api/clienteAxios';

export const deleteExpediente = async (id) => {
  try {
    const response = await clienteAxios.delete(`/api/expediente/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar expediente: ${error.message}`);
  }
};