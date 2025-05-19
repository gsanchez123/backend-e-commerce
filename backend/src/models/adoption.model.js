// models/adoption.model.js
import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema({
    petName: { type: String, required: true },
    adopterName: { type: String, required: true },
}, {
    timestamps: true
});

const AdoptionModel = mongoose.model('Adoption', adoptionSchema);
export default AdoptionModel;
