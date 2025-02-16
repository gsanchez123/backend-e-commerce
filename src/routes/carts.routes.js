import express from 'express';
import {
    getCartById,
    addProductToCart,
    removeProductFromCart,
    emptyCart,
    purchaseCart
} from '../controllers/carts.controller.js';

import { authenticateUser } from '../dao/middlewares/auth.middleware.js';
import { roleMiddleware } from '../dao/middlewares/role.middleware.js';

const router = express.Router();

// 📌 Obtener carrito por ID (Autenticación requerida)
router.get('/:cid', authenticateUser, getCartById);

// 📌 Agregar producto al carrito (Solo usuarios pueden agregar productos)
router.put('/:cid', authenticateUser, roleMiddleware('user'), addProductToCart);

// 📌 Eliminar producto del carrito
router.delete('/:cid/products/:pid', authenticateUser, removeProductFromCart);

// 📌 Vaciar carrito
router.delete('/:cid', authenticateUser, emptyCart);

// 📌 Finalizar compra del carrito
router.post('/:cid/purchase', authenticateUser, purchaseCart);

export default router;


