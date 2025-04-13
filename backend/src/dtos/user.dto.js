// src/dtos/user.dto.js

export class UserDTO {
    /**
     * Crea una instancia de UserDTO.
     * @param {Object} param0 - Objeto con la información del usuario.
     * @param {string} param0._id - El ID del usuario.
     * @param {string} param0.name - El nombre del usuario.
     * @param {string} param0.email - El correo del usuario.
     * @param {string} param0.role - El rol del usuario (user/admin).
     * @param {Date} [param0.createdAt] - Fecha de creación del usuario.
     * @param {Date} [param0.updatedAt] - Fecha de última actualización.
     */
    constructor({ _id, name, email, role, createdAt, updatedAt }) {
        this.id = _id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
