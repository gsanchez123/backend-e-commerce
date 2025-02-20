# backend-e-commerce 2
# E-Commerce Final

Este proyecto es la entrega final de e-commerce, implementado con una arquitectura en capas, DAO, Repository, DTO, autenticación con roles, mailing (Mailtrap) y mensajería SMS/WhatsApp (Twilio).

## Requisitos

- Node.js v16+
- MongoDB (local o Atlas)
- Cuenta en Mailtrap para correos
- Cuenta en Twilio para SMS/Whatsapp

RUTAS PRINCIPALES
GET / - Mensaje de bienvenida
POST /api/users/register - Registro de usuario
POST /api/users/login - Login de usuario
GET /api/users/current - Información del usuario actual (DTO)
POST /api/carts/:cid/purchase - Procesar compra del carrito
POST /api/products (Admin) - Crear producto
PUT /api/products/:pid (Admin) - Actualizar producto
DELETE /api/products/:pid (Admin) - Eliminar producto
Notas
Se utiliza Mailtrap para el envío de correos.
Se utiliza Twilio para el envío de SMS/Whatsapp.
La lógica de compra verifica stock y genera un ticket, dejando en el carrito solo los productos no procesados.