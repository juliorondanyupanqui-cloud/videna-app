const express = require('express');
const cors = require('cors');
require('dotenv').config();

const canchaRoutes = require('./routes/canchaRoutes');
const reservaRoutes = require('./routes/reservaRoutes'); // <--- Importante

const app = express();

app.use(cors());
app.use(express.json());

// Endpoints
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', service: 'La Videna API REST' });
});

app.use('/api/v1/canchas', canchaRoutes);
app.use('/api/v1/reservas', reservaRoutes); // <--- Registrar ruta

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});