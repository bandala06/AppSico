const express = require('express');
const router = express.Router();
const expedienteController = require('../controllers/expedienteController'); 

// Solo rutas de expediente
router.get('/todos', expedienteController.getAllExpedientes); 
router.post('/', expedienteController.createExpediente); 
router.get('/:no_control', expedienteController.getExpedienteByNoControl);
router.put('/:id', expedienteController.updateExpediente);
router.delete('/:id', expedienteController.deleteExpediente);

module.exports = router;