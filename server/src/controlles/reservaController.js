const prisma = require('../config/db');

// POST /api/v1/reservas - Crear una nueva reserva
const crearReserva = async (req, res) => {
    try {
    const { canchaId, clienteNombre, fecha, hora, duracion } = req.body;

    // 1. Validar que la cancha exista
    const cancha = await prisma.cancha.findUnique({ where: { id: canchaId } });
    if (!cancha) {
        return res.status(404).json({ success: false, message: 'La cancha seleccionada no existe.' });
    }

    // 2. Formatear la fecha y hora completa
    const fechaHoraInicio = new Date(`${fecha}T${hora}:00`);

    // 3. Validar solapamiento de horarios (Regla de negocio)
    const reservaExistente = await prisma.reserva.findFirst({
        where: {
        canchaId,
        estado: { not: 'CANCELADA' },
        fechaHora: fechaHoraInicio
        }
    });

    if (reservaExistente) {
        return res.status(400).json({
        success: false,
        message: 'La cancha ya se encuentra reservada para esa fecha y hora.'
        });
    }

    // 4. Buscar o registrar al cliente provisorio
    let usuario = await prisma.usuario.findFirst({
        where: { nombre: clienteNombre }
    });

    if (!usuario) {
        usuario = await prisma.usuario.create({
            data: {
            nombre: clienteNombre,
            email: `cliente_${Date.now()}@videna.pe`,
            password: 'password_provisorio'
            }
        });
    }

    // 5. Calcular monto total
    const duracionHoras = parseInt(duracion) || 1;
    const total = parseFloat(cancha.precioHora) * duracionHoras;

    // 6. Guardar la reserva en PostgreSQL
    const nuevaReserva = await prisma.reserva.create({
        data: {
        fechaHora: fechaHoraInicio,
        duracion: duracionHoras,
        total,
        usuarioId: usuario.id,
        canchaId: cancha.id
        },
        include: { cancha: true, usuario: true }
    });

    res.status(201).json({
        success: true,
        message: '¡Reserva registrada y confirmada exitosamente!',
        data: nuevaReserva
    });

    } catch (error) {
        res.status(500).json({
        success: false,
        message: 'Error interno al procesar la reserva',
        error: error.message
        });
    }
};

module.exports = { crearReserva };