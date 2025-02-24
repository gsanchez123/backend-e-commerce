import { Router } from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/products.controller.js';

import { authenticateUser } from '../dao/middlewares/auth.middleware.js';
import { roleMiddleware } from '../dao/middlewares/role.middleware.js';

const router = Router();

//  Obtiene todos los productos
router.get('/', getProducts);

//  Obtiene un producto por ID
router.get('/:id', getProductById);

//  Crea un producto (Solo administradores pueden hacerlo)
router.post('/', authenticateUser, roleMiddleware('admin'), createProduct);

//  Actualiza un producto (Solo administradores)
router.put('/:id', authenticateUser, roleMiddleware('admin'), updateProduct);

//  Elimina un producto (Solo administradores)
router.delete('/:id', authenticateUser, roleMiddleware('admin'), deleteProduct);

export default router;
