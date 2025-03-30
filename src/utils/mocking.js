import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

// Función para encriptar contraseñas
const hashPassword = (password) => bcrypt.hashSync(password, 10);

// Función para generar usuarios mockeados
export const generateUsers = (num) => {
    const users = [];

    for (let i = 0; i < num; i++) {
        users.push({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: hashPassword("coder123"),
            role: faker.helpers.arrayElement(["user", "admin"]),
            pets: [],
        });
    }

    return users;
};

// Función para generar mascotas mockeadas
export const generatePets = (num) => {
    const pets = [];

    for (let i = 0; i < num; i++) {
        pets.push({
            name: faker.animal.cat(),
            age: faker.number.int({ min: 1, max: 15 }),
            type: faker.helpers.arrayElement(["dog", "cat", "rabbit"]),
            owner: faker.database.mongodbObjectId(),
        });
    }

    return pets;
};
