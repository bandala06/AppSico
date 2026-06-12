const db = require('../config/config');

const User = {};

User.getAll = () => {
    const sql = `SELECT * FROM psicologia.usuario`;
    return db.manyOrNone(sql);
}

User.Create = async (user) => {
    const sql = `
        INSERT INTO psicologia.usuario (
            no_control,
            nombre,
            apellido,
            sexo,
            edad,
            estado_civil,
            direccion,
            telefono,
            ingenieria,
            modalidad,
            semestre,
            fecha_registro,
            email,
            password,
            rol
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
        RETURNING no_control`;

    return db.oneOrNone(sql, [
        user.no_control || null,
        user.nombre || null,
        user.apellido || null,
        user.sexo || null,
        user.edad || null,
        user.estado_civil || null,
        user.direccion || null,
        user.telefono || null,
        user.ingenieria || null,
        user.modalidad || null,
        user.semestre || null,
        user.fecha_registro || new Date(),
        user.email,
        user.password,
        user.rol || 'usuario'
    ]);
}

User.getByEmail = (email) => {
    const sql = `SELECT * FROM psicologia.usuario WHERE email = $1`;
    return db.oneOrNone(sql, [email]);
}

User.getById = (id) => {
    const sql = `SELECT * FROM psicologia.usuario WHERE no_control = $1`;
    return db.oneOrNone(sql, [id]);
};

module.exports = User;