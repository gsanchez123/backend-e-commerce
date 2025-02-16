// Conexión a Socket.IO
const socket = io();

// Ejemplo de Toastify para notificaciones
function showToast(message, bgColor = "#4CAF50") {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: bgColor,
    }).showToast();
}

// Escuchar el evento de nuevo producto (para notificar en la página de productos)
socket.on("nuevoProducto", (product) => {
    showToast("Nuevo producto agregado: " + product.name);
});

// Código para el Chat en Vivo
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const messagesList = document.getElementById('messages');

if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (messageInput.value.trim() !== "") {
            socket.emit('chat message', messageInput.value.trim());
            messageInput.value = "";
        }
    });

    socket.on('chat message', (msg) => {
        const li = document.createElement('li');
        li.className = "list-group-item";
        li.textContent = msg;
        messagesList.appendChild(li);
        // Opcional: hacer scroll hacia el último mensaje
        messagesList.scrollTop = messagesList.scrollHeight;
    });
}

// Ejemplo de agregar producto al carrito sin recargar la página
const cartButtons = document.querySelectorAll('.add-to-cart');
cartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id');
        fetch(`/api/carts/add/${productId}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    showToast("Producto agregado al carrito");
                } else {
                    showToast("Error al agregar producto", "#e74c3c");
                }
            })
            .catch(err => {
                console.error(err);
                showToast("Error en la conexión", "#e74c3c");
            });
    });
});
