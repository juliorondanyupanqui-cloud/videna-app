const prisma = require('../config/db');

const getCanchas = async (req, res) => {
    try {
    const canchas = await prisma.cancha.findMany({ where: { disponible: true } });
    res.json({ success: true, data: canchas });
    } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener canchas', error: error.message });
    }
};

module.exports = { getCanchas };