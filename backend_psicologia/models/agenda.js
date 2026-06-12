const db = require('../config/config');

const Agenda = {};

Agenda.getAll = () => {
    const sql = `SELECT * FROM psicologia.agenda ORDER BY start_time ASC`;
    return db.manyOrNone(sql);
};

Agenda.create = async (event) => {
    const sql = `
        INSERT INTO psicologia.agenda (
            no_control_user,
            no_control_admin,
            title,
            session_number,
            start_time,
            end_time,
            status,
            modality
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`;

    return db.oneOrNone(sql, [
        event.no_control_user || null,
        event.no_control_admin || null,
        event.title || null,
        event.session_number || null,
        event.start_time,
        event.end_time,
        event.status || 'Pendiente',
        event.modality || 'Presencial'
    ]);
};

Agenda.getByNoControl = (no_control) => {
    const sql = `SELECT * FROM psicologia.agenda WHERE no_control_user = $1 ORDER BY start_time ASC`;
    return db.manyOrNone(sql, [no_control]);
};

Agenda.update = async (id, event) => {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (event.no_control_user !== undefined) {
        updates.push(`no_control_user = $${paramCount}`);
        values.push(event.no_control_user);
        paramCount++;
    }

    if (event.no_control_admin !== undefined) {
        updates.push(`no_control_admin = $${paramCount}`);
        values.push(event.no_control_admin);
        paramCount++;
    }

    if (event.title !== undefined) {
        updates.push(`title = $${paramCount}`);
        values.push(event.title);
        paramCount++;
    }

    if (event.session_number !== undefined) {
        updates.push(`session_number = $${paramCount}`);
        values.push(event.session_number);
        paramCount++;
    }

    if (event.start_time !== undefined) {
        updates.push(`start_time = $${paramCount}`);
        values.push(event.start_time);
        paramCount++;
    }

    if (event.end_time !== undefined) {
        updates.push(`end_time = $${paramCount}`);
        values.push(event.end_time);
        paramCount++;
    }

    if (event.status !== undefined) {
        updates.push(`status = $${paramCount}`);
        values.push(event.status);
        paramCount++;
    }

    if (event.modality !== undefined) {
        updates.push(`modality = $${paramCount}`);
        values.push(event.modality || 'Presencial');
        paramCount++;
    }

    if (updates.length === 0) return null;

    values.push(id);

    const sql = `
        UPDATE psicologia.agenda
        SET ${updates.join(', ')},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramCount} 
        RETURNING *`;

    return db.oneOrNone(sql, values);
};

Agenda.delete = async (id) => {
    const sql = `DELETE FROM psicologia.agenda WHERE id = $1 RETURNING *`;
    return db.oneOrNone(sql, [id]);
};

Agenda.findById = async (id) => {
    const sql = `SELECT * FROM psicologia.agenda WHERE id = $1`;
    return db.oneOrNone(sql, [id]);
};

// Eliminar este método si no lo usas
// Agenda.getEventsWithLocalTime = async () => { ... }

module.exports = Agenda;