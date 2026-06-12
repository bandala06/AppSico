const expedienteModel = require('../models/expediente');
const pool = require('../config/config'); 

const expedienteController = {};

// 1. Obtener todos los expedientes
expedienteController.getAllExpedientes = async (req, res) => {
    try {
        const expedientes = await expedienteModel.getAll();
        res.status(200).json(expedientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener expedientes' });
    }
};

// 2. CREAR O ACTUALIZAR EXPEDIENTE (Lógica unificada)
expedienteController.createExpediente = async (req, res) => {
    const { 
        no_control, nombre, sexo, edad, estado_civil, direccion, 
        telefono, ingenieria, modalidad, semestre, motivo_consulta, 
        desencadenantes_motivo, plan_orientacion, seguimiento, numero_sesiones 
    } = req.body;

    try {
        const partes = nombre ? nombre.trim().split(/\s+/) : [];
        const nombreFinal = partes.length > 0 ? partes[0] : 'Sin nombre';
        const apellidoFinal = partes.length > 1 ? partes.slice(1).join(' ') : 'Apellido';

        // UPSERT de Usuario
        await pool.query(`
            INSERT INTO psicologia.usuario (
                no_control, nombre, apellido, sexo, edad, estado_civil, 
                direccion, telefono, ingenieria, modalidad, semestre, 
                email, password, rol
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'usuario')
            ON CONFLICT (no_control) 
            DO UPDATE SET 
                nombre = EXCLUDED.nombre,
                apellido = EXCLUDED.apellido,
                sexo = EXCLUDED.sexo,
                edad = EXCLUDED.edad,
                estado_civil = EXCLUDED.estado_civil,
                direccion = EXCLUDED.direccion,
                telefono = EXCLUDED.telefono,
                ingenieria = EXCLUDED.ingenieria,
                modalidad = EXCLUDED.modalidad,
                semestre = EXCLUDED.semestre;
        `, [
            no_control, nombreFinal, apellidoFinal, sexo, parseInt(edad) || 0, 
            estado_civil, direccion, telefono, ingenieria, modalidad, 
            parseInt(semestre) || 1, `${no_control}@itt.edu`, '123456'
        ]);

        // UPSERT de Expediente
        const result = await pool.query(`
            INSERT INTO psicologia.expediente (
                no_control, motivo_consulta, desencadenantes_motivo, 
                plan_orientacion, seguimiento, numero_sesiones
            ) VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (no_control) 
            DO UPDATE SET 
                motivo_consulta = EXCLUDED.motivo_consulta,
                desencadenantes_motivo = EXCLUDED.desencadenantes_motivo,
                plan_orientacion = EXCLUDED.plan_orientacion,
                seguimiento = EXCLUDED.seguimiento,
                numero_sesiones = EXCLUDED.numero_sesiones
            RETURNING *;
        `, [no_control, motivo_consulta, desencadenantes_motivo, plan_orientacion, seguimiento, parseInt(numero_sesiones) || 0]);

        // Manejo seguro de la respuesta según la librería usada
        const expedienteFinal = (result && result.rows) ? result.rows[0] : (Array.isArray(result) ? result[0] : result);

        return res.status(201).json({
            success: true,
            message: "Expediente guardado correctamente",
            data: expedienteFinal
        });

    } catch (error) {
        console.error("Error en createExpediente:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Obtener por No. Control (Para el buscador)
expedienteController.getExpedienteByNoControl = async (req, res) => {
    const noControl = req.params.no_control;
    try {
        const data = await expedienteModel.getByNoControl(noControl);
        res.status(200).json({
            success: true,
            usuario: data.usuario,
            expediente: data.expediente
        });
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).json({ success: false, error: 'Error interno' });
    }
};

// 4. Actualizar por ID (Para rutas PUT)
expedienteController.updateExpediente = async (req, res) => {
    const { id } = req.params;
    try {
        const actualizado = await expedienteModel.update(id, req.body);
        res.status(200).json(actualizado);
    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).json({ message: 'Error al actualizar' });
    }
};

// 5. Eliminar expediente
expedienteController.deleteExpediente = async (req, res) => {
    const { id } = req.params; 
    try {
        await expedienteModel.delete(id);
        res.status(200).json({ success: true, message: 'Eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar:', error);
        res.status(500).json({ message: 'Error al eliminar' });
    }
};

module.exports = expedienteController;