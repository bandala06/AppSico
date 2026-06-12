const db = require('../config/config');

const Expediente = {};

// Obtener todos los expedientes
Expediente.getAll = () => {
    const sql = `SELECT * FROM expediente`;
    return db.manyOrNone(sql);
};

// Crear o Actualizar expediente (UPSERT)
// Usamos ON CONFLICT para que si ya existe el no_control, lo actualice en vez de fallar
Expediente.create = async (expediente) => {
    const sql = `
        INSERT INTO expediente (
            no_control,
            numero_sesiones,
            motivo_consulta,
            desencadenantes_motivo,
            plan_orientacion,
            seguimiento
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        ON CONFLICT (no_control) 
        DO UPDATE SET 
            numero_sesiones = EXCLUDED.numero_sesiones,
            motivo_consulta = EXCLUDED.motivo_consulta,
            desencadenantes_motivo = EXCLUDED.desencadenantes_motivo,
            plan_orientacion = EXCLUDED.plan_orientacion,
            seguimiento = EXCLUDED.seguimiento
        RETURNING *`;

    return db.oneOrNone(sql, [
        expediente.no_control,
        expediente.numero_sesiones,
        expediente.motivo_consulta,
        expediente.desencadenantes_motivo,
        expediente.plan_orientacion,
        expediente.seguimiento
    ]);
};

// Obtener la información del usuario y su expediente por no_control
Expediente.getByNoControl = async (no_control) => {
    const sqlUsuario = `SELECT * FROM psicologia.usuario WHERE no_control = $1`;
    const sqlExpediente = `SELECT * FROM psicologia.expediente WHERE no_control = $1`;

    try {
        const usuario = await db.oneOrNone(sqlUsuario, [no_control]);
        const expediente = await db.oneOrNone(sqlExpediente, [no_control]);

        // ELIMINAMOS EL THROW ERROR. 
        // Si el usuario no existe, simplemente devolvemos null y el sistema sigue vivo.
        return {
            usuario: usuario || null,
            expediente: expediente || null
        };
    } catch (error) {
        console.error('Error al obtener datos en el modelo:', error);
        throw error;
    }
};

// Obtener por ID (para la tabla visual)
Expediente.getByUserId = (no_control) => {
    const sql = `SELECT * FROM psicologia.expediente WHERE no_control = $1`;
    return db.manyOrNone(sql, [no_control]);
};

// Actualizar un expediente existente por ID
Expediente.update = async (id, expediente) => {
    const sql = `
        UPDATE psicologia.expediente
        SET
            numero_sesiones = $1,
            motivo_consulta = $2,
            desencadenantes_motivo = $3,
            plan_orientacion = $4,
            seguimiento = $5
        WHERE id = $6 RETURNING *`;

    return db.oneOrNone(sql, [
        expediente.numero_sesiones,
        expediente.motivo_consulta,
        expediente.desencadenantes_motivo,
        expediente.plan_orientacion,
        expediente.seguimiento,
        id  
    ]);
};

// Eliminar un expediente
Expediente.delete = async (id) => {
    const sql = `DELETE FROM psicologia.expediente WHERE id = $1 RETURNING *`;
    return db.oneOrNone(sql, [id]);
};

module.exports = Expediente;