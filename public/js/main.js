// Conectar con el servidor WebSocket
const socket = io();

// 📢 Escuchar mensajes de chat y mostrarlos en la pantalla
socket.on('chat message', (msg) => {
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        const messageElement = document.createElement('p');
        messageElement.textContent = msg;
        chatBox.appendChild(messageElement);
    }
});

// 📩 Enviar mensajes de chat
document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const message = input.value.trim();
            if (message) {
                socket.emit('chat message', message);
                input.value = '';
            }
        });
    }
});

// 🛒 Función para actualizar el carrito en pantalla
function updateCart() {
    fetch('/api/carts')
        .then(response => response.json())
        .then(cart => {
            const cartCount = document.getElementById('cart-count');
            const cartItemsContainer = document.getElementById('cart-items');

            if (cartCount) cartCount.textContent = cart.items.length;
            if (cartItemsContainer) {
                cartItemsContainer.innerHTML = ''; // Limpiar contenido previo
                
                cart.items.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.classList.add('cart-item');
                    cartItem.innerHTML = `
                        <p><strong>${item.name}</strong> - $${item.price}</p>
                        <button class="btn btn-danger btn-sm remove-from-cart" data-id="${item._id}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    `;
                    cartItemsContainer.appendChild(cartItem);
                });

                // Agregar evento a los botones de eliminar
                document.querySelectorAll('.remove-from-cart').forEach(button => {
                    button.addEventListener('click', removeFromCart);
                });
            }
        })
        .catch(error => console.error('Error al cargar el carrito:', error));
}

// 🛒 Agregar productos al carrito
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = event.target.dataset.id;
            
            fetch('/api/carts/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto agregado al carrito',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    updateCart(); // Actualizar carrito después de añadir un producto
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    updateCart(); // Cargar carrito al inicio
});

// ❌ Eliminar productos del carrito
function removeFromCart(event) {
    const productId = event.target.dataset.id;

    fetch(`/api/carts/remove/${productId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'info',
                title: 'Producto eliminado',
                showConfirmButton: false,
                timer: 1500
            });
            updateCart(); // Actualizar carrito después de eliminar un producto
        }
    })
    .catch(error => console.error('Error al eliminar producto:', error));
}
