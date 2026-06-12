const Agenda = require('../models/agenda');
const agendaController = {};

// Función para normalizar fechas
const normalizarFecha = (fechaString) => {
    if (!fechaString) return null;
    
    console.log('📅 Fecha recibida para normalizar:', fechaString);
    
    // Si ya es ISO string con Z, dejarla igual
    if (fechaString.includes('T') && fechaString.endsWith('Z')) {
        return fechaString;
    }
    
    // Si es ISO string sin Z, agregar Z
    if (fechaString.includes('T') && fechaString.includes(':')) {
        if (fechaString.includes('+') || fechaString.includes('-')) {
            return fechaString;
        } else {
            const fecha = new Date(fechaString);
            return fecha.toISOString();
        }
    }
    
    const fecha = new Date(fechaString);
    if (isNaN(fecha.getTime())) {
        console.warn('⚠️ No se pudo parsear la fecha:', fechaString);
        return fechaString;
    }
    
    return fecha.toISOString();
};

// 🔥 NUEVO: Controlador ESPECÍFICO para react-big-calendar
agendaController.getCalendarEvents = async (req, res) => {
    try {
        console.log('🟢 [CALENDARIO] Solicitando eventos para calendario');
        
        const events = await Agenda.getAll();
        
        console.log(`📊 Total eventos en BD: ${events.length}`);
        
        if (events.length > 0) {
            console.log('📅 Primer evento en BD:', {
                id: events[0].id,
                title: events[0].title,
                start: events[0].start_time,
                end: events[0].end_time,
                status: events[0].status
            });
        }
        
        // 🔥 FORMATO ESPECÍFICO PARA REACT-BIG-CALENDAR
        const calendarEvents = events.map(event => {
            // Convertir strings a objetos Date
            const startDate = new Date(event.start_time);
            const endDate = new Date(event.end_time);
            
            // Ajustar por timezone (si es necesario)
            const start = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000));
            const end = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000));
            
            return {
                id: event.id,
                title: event.title || `Sesión ${event.session_number || ''}`.trim(),
                start: start,
                end: end,
                session_number: event.session_number,
                status: event.status || 'Pendiente',
                modality: event.modality || 'Presencial',
                no_control_user: event.no_control_user,
                no_control_admin: event.no_control_admin,
                // Campos adicionales para el frontend
                resourceId: event.id,
                allDay: false
            };
        });
        
        console.log(`✅ Eventos formateados para calendario: ${calendarEvents.length}`);
        
        res.status(200).json(calendarEvents);
    } catch (error) {
        console.error('❌ Error en getCalendarEvents:', error);
        res.status(500).json({ 
            message: 'Error al obtener eventos para calendario',
            error: error.message 
        });
    }
};

// Mantener compatibilidad con el endpoint antiguo
agendaController.getAllEvents = async (req, res) => {
    try {
        console.log('🟡 Solicitando todos los eventos (formato general)');
        
        const events = await Agenda.getAll();
        
        // Formato para compatibilidad
        const formattedEvents = events.map(event => ({
            id: event.id,
            title: event.title,
            session_number: event.session_number,
            start_time: event.start_time,
            end_time: event.end_time,
            status: event.status,
            modality: event.modality,
            no_control_user: event.no_control_user,
            no_control_admin: event.no_control_admin,
            start: event.start_time, // Para compatibilidad
            end: event.end_time      // Para compatibilidad
        }));
        
        console.log(`📦 Eventos enviados: ${formattedEvents.length}`);
        
        res.status(200).json(formattedEvents);
    } catch (error) {
        console.error('❌ Error en getAllEvents:', error);
        res.status(500).json({ 
            message: 'Error al obtener eventos',
            error: error.message 
        });
    }
};

agendaController.createEvent = async (req, res) => {
    try {
        const { estatus, status = estatus || 'Pendiente', ...datos } = req.body;
        
        console.log('➕ CREANDO EVENTO');
        console.log('Datos recibidos:', datos);
        
        // Normalizar fechas
        const startTimeNormalizado = normalizarFecha(datos.start_time);
        const endTimeNormalizado = normalizarFecha(datos.end_time);
        
        console.log('Fechas normalizadas:', {
            start: startTimeNormalizado,
            end: endTimeNormalizado
        });
        
        const eventoData = {
            ...datos,
            start_time: startTimeNormalizado,
            end_time: endTimeNormalizado,
            status: status,
            modality: datos.modality || 'Presencial'
        };
        
        const newEvent = await Agenda.create(eventoData);
        
        console.log(`✅ Evento creado ID: ${newEvent.id}`);
        
        // Devolver en formato para react-big-calendar
        const responseEvent = {
            ...newEvent,
            start: new Date(newEvent.start_time),
            end: new Date(newEvent.end_time)
        };
        
        res.status(201).json(responseEvent);
    } catch (error) {
        console.error('❌ Error al crear evento:', error);
        res.status(500).json({ 
            message: 'Error al crear evento',
            error: error.message 
        });
    }
};

agendaController.getEventsByNoControl = async (req, res) => {
    const noControl = req.params.no_control;
    try {
        const events = await Agenda.getByNoControl(noControl);
        if (events && events.length > 0) {
            // Formatear para el frontend
            const formattedEvents = events.map(event => ({
                ...event,
                start: new Date(event.start_time),
                end: new Date(event.end_time)
            }));
            
            res.status(200).json(formattedEvents);
        } else {
            res.status(404).json({ message: 'No se encontraron eventos para el usuario' });
        }
    } catch (error) {
        console.error('Error al obtener eventos por no_control:', error);
        res.status(500).json({ 
            message: 'Error al obtener eventos',
            error: error.message 
        });
    }
};

agendaController.updateEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const { estatus, status = estatus, ...datos } = req.body;
        
        console.log('✏️ ACTUALIZANDO EVENTO ID:', id);
        console.log('Datos recibidos:', { estatus, status, ...datos });
        
        const updateData = {};
        
        // Manejar fechas si vienen
        if (datos.start_time !== undefined) {
            updateData.start_time = normalizarFecha(datos.start_time);
        }
        
        if (datos.end_time !== undefined) {
            updateData.end_time = normalizarFecha(datos.end_time);
        }
        
        // Otros campos
        if (datos.title !== undefined) updateData.title = datos.title;
        if (datos.session_number !== undefined) updateData.session_number = datos.session_number;
        if (datos.no_control_user !== undefined) updateData.no_control_user = datos.no_control_user;
        if (datos.no_control_admin !== undefined) updateData.no_control_admin = datos.no_control_admin;
        if (datos.modality !== undefined) updateData.modality = datos.modality;
        
        // Estado
        if (status !== undefined) {
            updateData.status = status;
        } else if (estatus !== undefined) {
            updateData.status = estatus;
        }
        
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ 
                message: 'No se proporcionaron datos para actualizar' 
            });
        }

        console.log('Datos para actualizar:', updateData);
        
        const updatedEvent = await Agenda.update(id, updateData);
        if (updatedEvent) {
            // Formatear respuesta
            const responseEvent = {
                ...updatedEvent,
                start: new Date(updatedEvent.start_time),
                end: new Date(updatedEvent.end_time)
            };
            
            res.status(200).json(responseEvent);
        } else {
            res.status(404).json({ message: 'No se encontro el evento' });
        }
    } catch (error) {
        console.error('❌ Error al actualizar evento:', error);
        res.status(500).json({ 
            message: 'Error al actualizar evento',
            error: error.message 
        });
    }
};

agendaController.deleteEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedEvent = await Agenda.delete(id);
        if (deletedEvent) {
            res.status(200).json({ 
                message: 'Evento eliminado correctamente',
                id: id 
            });
        } else {
            res.status(404).json({ message: 'No se encontro el evento' });
        }
    } catch (error) {
        console.error('❌ Error al eliminar evento:', error);
        res.status(500).json({ 
            message: 'Error al eliminar evento',
            error: error.message 
        });
    }
};

module.exports = agendaController;