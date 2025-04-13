import Product from '../models/products.model.js';

// 📌 Obtener productos con filtros, paginación y ordenamiento
export const getProducts = async (req, res) => {
    try {
        let { limit = 10, page = 1, sort = 'asc', query = '' } = req.query;

        // Validar parámetros de consulta
        limit = parseInt(limit);
        page = parseInt(page);
        if (isNaN(limit) || limit <= 0) limit = 10;
        if (isNaN(page) || page <= 0) page = 1;
        
        const queryObj = query
            ? { $or: [{ name: { $regex: query, $options: 'i' } }, { category: { $regex: query, $options: 'i' } }] }
            : {};
        const sortOrder = sort === 'desc' ? -1 : 1;

        const products = await Product.find(queryObj)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ price: sortOrder })
            .lean(); // Reduce la carga en la base de datos

        const totalProducts = await Product.countDocuments(queryObj);
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
            nextLink: page < totalPages ? `/api/products?page=${page + 1}&limit=${limit}` : null
        });
    } catch (error) {
        console.error(`Error al obtener productos: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// 📌 Obtener un producto por ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).lean();
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', payload: product });
    } catch (error) {
        console.error(`Error al obtener producto: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// 📌 Agregar un producto con validaciones
export const createProduct = async (req, res) => {
    try {
        const { name, price, category, stock, description, thumbnail } = req.body;

        // Validaciones
        if (!name || !price || !category || !stock) {
            return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
        }

        const newProduct = new Product({ name, price, category, stock, description, thumbnail });
        await newProduct.save();

        // Emitir evento de notificación en tiempo real mediante Socket.IO
        if (req.app.get('io')) {
            req.app.get('io').emit('nuevoProducto', newProduct);
        }

        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        console.error(`Error al agregar producto: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// 📌 Actualizar un producto con validaciones
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        // Emitir evento de actualización en tiempo real
        if (req.app.get('io')) {
            req.app.get('io').emit('productoActualizado', updatedProduct);
        }

        res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        console.error(`Error al actualizar producto: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// 📌 Eliminar un producto con validación
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        // Emitir evento de eliminación en tiempo real
        if (req.app.get('io')) {
            req.app.get('io').emit('productoEliminado', id);
        }

        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        console.error(`Error al eliminar producto: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};
