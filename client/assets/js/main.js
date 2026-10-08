const API_URL = 'http://localhost:4000/api/v1';
let canchas = []; // Se poblará dinámicamente desde PostgreSQL

document.addEventListener('DOMContentLoaded', async () => {
    await cargarCanchasDesdeAPI();
    initReservas();
});

// 1. Obtener canchas reales desde el backend
async function cargarCanchasDesdeAPI() {
    try {
        const respuesta = await fetch(`${API_URL}/canchas`);
        const resultado = await respuesta.json();

        if (resultado.success) {
            canchas = resultado.data;
            console.log('Canchas cargadas desde la BD:', canchas);
        }
    } catch (error) {
        console.error('Error al obtener las canchas del servidor:', error);
    }
}

// 2. Vincular botones con las canchas obtenidas
function initReservas() {
    const botonesReservar = document.querySelectorAll('.card-footer .btn-secondary');

    botonesReservar.forEach((boton, index) => {
        boton.addEventListener('click', () => {
            const canchaSeleccionada = canchas[index];
            if (canchaSeleccionada) {
                abrirModalReserva(canchaSeleccionada);
            } else {
                alert('La cancha seleccionada no está disponible en este momento.');
            }
        });
    });
}

// 3. Modal dinámico y cálculo de montos
function abrirModalReserva(cancha) {
    const modalExistente = document.getElementById('modal-reserva');
    if (modalExistente) modalExistente.remove();

    const precioHora = parseFloat(cancha.precioHora);

    const modalHTML = `
        <div id="modal-reserva" class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" id="btn-cerrar">&times;</button>
                <h3>Reservar: <span>${cancha.nombre}</span></h3>
                <p class="modal-price">Precio por hora: <strong>S/ ${precioHora.toFixed(2)}</strong></p>
                
                <form id="form-reserva" class="reserva-form">
                    <div class="form-group">
                        <label for="cliente-nombre">Nombre completo:</label>
                        <input type="text" id="cliente-nombre" required placeholder="Ej. Juan Pérez">
                    </div>
                    <div class="form-group">
                        <label for="fecha-reserva">Fecha:</label>
                        <input type="date" id="fecha-reserva" required>
                    </div>
                    <div class="form-group">
                        <label for="hora-reserva">Hora de inicio:</label>
                        <input type="time" id="hora-reserva" required value="18:00">
                    </div>
                    <div class="form-group">
                        <label for="horas-reserva">Número de horas:</label>
                        <input type="number" id="horas-reserva" min="1" max="5" value="1" required>
                    </div>
                    <div class="form-summary">
                        <p>Monto Total: <strong id="monto-total">S/ ${precioHora.toFixed(2)}</strong></p>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Confirmar Reserva</button>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('modal-reserva');
    const btnCerrar = document.getElementById('btn-cerrar');
    const inputHoras = document.getElementById('horas-reserva');
    const montoTotalText = document.getElementById('monto-total');
    const formReserva = document.getElementById('form-reserva');

    btnCerrar.addEventListener('click', () => modal.remove());

    // Cálculo dinámico en tiempo real
    inputHoras.addEventListener('input', (e) => {
        const horas = parseInt(e.target.value) || 1;
        const total = horas * precioHora;
        montoTotalText.textContent = `S/ ${total.toFixed(2)}`;
    });

    // Envío del formulario a PostgreSQL vía API REST
    formReserva.addEventListener('submit', async (e) => {
        e.preventDefault();

        const datosReserva = {
            canchaId: cancha.id,
            clienteNombre: document.getElementById('cliente-nombre').value,
            fecha: document.getElementById('fecha-reserva').value,
            hora: document.getElementById('hora-reserva').value,
            duracion: inputHoras.value
        };

        try {
            const respuesta = await fetch(`${API_URL}/reservas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosReserva)
            });

            const resultado = await respuesta.json();

            if (resultado.success) {
                alert(`¡Éxito! ${resultado.message}`);
                modal.remove();
            } else {
                alert(`Error: ${resultado.message}`);
            }
        } catch (error) {
            console.error('Error al guardar reserva:', error);
            alert('No se pudo conectar con el servidor.');
        }
    });
}