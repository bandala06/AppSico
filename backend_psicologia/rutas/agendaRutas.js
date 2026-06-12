const express = require('express');
const router = express.Router();
const agendaController = require('../controllers/agendaController');

//  AGREGAR LA NUEVA RUTA PARA EL CALENDARIO
router.get('/getAllEvents', agendaController.getAllEvents);
router.get('/getCalendarEvents', agendaController.getCalendarEvents); // ← NUEVA RUTA IMPORTANTE
router.post('/createEvent', agendaController.createEvent);
router.get('/getEvents/:no_control', agendaController.getEventsByNoControl);
router.put('/updateEvent/:id', agendaController.updateEvent);
router.delete('/deleteEvent/:id', agendaController.deleteEvent);

module.exports = router;