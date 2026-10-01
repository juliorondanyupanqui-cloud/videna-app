// Estructura de datos de canchas (ES6)
const canchas = [
    { id: 1, nombre: 'Cancha Estelar - Fútbol 7', precioHora: 80 },
    { id: 2, nombre: 'Losa Polideportiva - Vóley & Básquet', precioHora: 50 }
];

document.addEventListener('DOMContentLoaded', () => {
    initReservas();
});

function initReservas() {
    const botonesReservar = document.querySelectorAll('.card-footer .btn-secondary');

    botonesReservar.forEach((boton, index) => {
        boton.addEventListener('click', () => {
            const canchaSeleccionada = canchas[index];
            abrirModalReserva(canchaSeleccionada);
        });
    });
}

function abrirModalReserva(cancha) {
    // Eliminar modal anterior si existe
    const modalExistente = document.getElementById('modal-reserva');
    if (modalExistente) modalExistente.remove();

    // Inyección de HTML dinámico para el modal
    const modalHTML = `
        <div id="modal-reserva" class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" id="btn-cerrar">&times;</button>
                <h3>Reservar: <span>${cancha.nombre}</span></h3>
                <p class="modal-price">Precio por hora: <strong>S/ ${cancha.precioHora}.00</strong></p>
                
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
                        <label for="horas-reserva">Número de horas:</label>
                        <input type="number" id="horas-reserva" min="1" max="5" value="1" required>
                    </div>
                    <div class="form-summary">
                        <p>Monto Total: <strong id="monto-total">S/ ${cancha.precioHora}.00</strong></p>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Confirmar Reserva</button>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Eventos del modal
    const modal = document.getElementById('modal-reserva');
    const btnCerrar = document.getElementById('btn-cerrar');
    const inputHoras = document.getElementById('horas-reserva');
    const montoTotalText = document.getElementById('monto-total');
    const formReserva = document.getElementById('form-reserva');

    btnCerrar.addEventListener('click', () => modal.remove());

    // Cálculo dinámico en tiempo real
    inputHoras.addEventListener('input', (e) => {
        const horas = parseInt(e.target.value) || 1;
        const total = horas * cancha.precioHora;
        montoTotalText.textContent = `S/ ${total}.00`;
    });

    // Envío de formulario
    formReserva.addEventListener('submit', (e) => {
        e.preventDefault();
        const cliente = document.getElementById('cliente-nombre').value;
        const fecha = document.getElementById('fecha-reserva').value;
        const horas = inputHoras.value;

        alert(`¡Reserva registrada con éxito!\n\nCliente: ${cliente}\nCancha: ${cancha.nombre}\nFecha: ${fecha}\nHoras: ${horas}`);
        modal.remove();
    });
}