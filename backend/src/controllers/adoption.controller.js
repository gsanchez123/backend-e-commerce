// controllers/adoption.controller.js
import AdoptionModel from '../models/adoption.model.js';

export const getAllAdoptions = async (req, res) => {
    const adoptions = await AdoptionModel.find();
    res.status(200).json(adoptions);
};

export const createAdoption = async (req, res) => {
    const { petName, adopterName } = req.body;
    const newAdoption = await AdoptionModel.create({ petName, adopterName });
    res.status(201).json(newAdoption);
};

export const getAdoptionById = async (req, res) => {
    const { id } = req.params;
    const adoption = await AdoptionModel.findById(id);
    if (!adoption) return res.status(404).json({ message: 'No se encontró la adopción' });
    res.json(adoption);
};

export const deleteAdoption = async (req, res) => {
    const { id } = req.params;
    await AdoptionModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Adopción eliminada' });
};
