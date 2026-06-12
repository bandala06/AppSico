import axios from 'axios';

// Detecta automáticamente si usas Vite o Create React App, o usa la IP estática por defecto
const URL_BASE = process.env.REACT_APP_API_URL || import.meta.env?.VITE_API_URL || 'http://192.168.5.252:3000';

const clienteAxios = axios.create({
  baseURL: URL_BASE,
});

export default clienteAxios;