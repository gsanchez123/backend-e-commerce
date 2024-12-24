import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    stock: { type: Number, default: 0 },
    availability: { type: Boolean, default: true },
    thumbnail: { type: String }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
