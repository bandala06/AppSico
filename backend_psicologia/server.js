const express = require('express');
const app = express();
const cors = require('cors');

const usersRoutes = require('./rutas/usersRoutes');
const adminRoutes = require('./rutas/aminRoutes');
const expedienteRoutes = require('./rutas/expedienteRutas');
const agendaRoutes = require('./rutas/agendaRutas');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/expediente', expedienteRoutes);
app.use('/api/agenda', agendaRoutes);

app.get('/', (req, res) => {
    res.json({ 
        status: 'ok',
        message: 'API funcionando'
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor en puerto ${port}`);
});