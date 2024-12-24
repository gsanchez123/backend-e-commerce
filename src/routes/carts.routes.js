import express from 'express';
import { getCartById, addProductToCart, removeProductFromCart, emptyCart } from '../controllers/carts.controller.js';

const router = express.Router();

router.get('/:cid', getCartById);
router.put('/:cid', addProductToCart);
router.delete('/:cid/products/:pid', removeProductFromCart);
router.put('/:cid/products/:pid', addProductToCart);  // Para actualizar la cantidad de productos
router.delete('/:cid', emptyCart);

export default router;

