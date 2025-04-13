// src/dtos/cart.dto.js
import Joi from 'joi';

export const cartPurchaseSchema = Joi.object({
    productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.empty': 'El ID del producto no puede estar vacío.',
        'string.pattern.base': 'El ID del producto debe ser un ObjectId válido.',
        'any.required': 'El ID del producto es obligatorio.'
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        'number.base': 'La cantidad debe ser un número.',
        'number.integer': 'La cantidad debe ser un número entero.',
        'number.min': 'La cantidad mínima permitida es 1.',
        'any.required': 'La cantidad es obligatoria.'
    })
});
