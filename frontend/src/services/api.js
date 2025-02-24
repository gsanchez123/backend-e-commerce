import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};

export const addToCart = async (productId) => {
    await axios.post(`${API_URL}/carts/add`, { productId });
};
