const db = require('../config/config');

const Admin = {
    getByEmail: async (email) => {
        const query = 'SELECT * FROM psicologia.administradores WHERE email = $1';
        return await db.oneOrNone(query, [email]);
    },

    getById: async (id) => {
        const query = 'SELECT * FROM psicologia.administradores WHERE id = $1';
        return await db.oneOrNone(query, [id]);
    },

    getAll: async () => {
        const query = 'SELECT id, nombre, email, rol FROM psicologia.administradores';
        return await db.query(query);
    },

    Create: async (adminData) => {
        const query = `
            INSERT INTO psicologia.administradores (nombre, email, password, rol) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id
        `;
        return await db.one(query, [
            adminData.nombre, 
            adminData.email, 
            adminData.password, 
            adminData.rol || 'admin'
        ]);
    }
};

module.exports = Admin;