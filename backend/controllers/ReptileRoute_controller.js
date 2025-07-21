import Reptile from "../models/Reptile.js";
import mongoose from 'mongoose';
import cloudinary from '../config/CloudinaryConfig.js';
import Feeding from "../models/Feeding.js";
import Notification from "../models/Notification.js";
import fs from 'fs/promises';
import streamifier from 'streamifier';

import { parseDateOrNull } from '../utils/parseReptileHelpers.js';

export const GetAllReptile = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 20;

        const reptile = await Reptile.find({})
            .sort({ species: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        const totalResults = await Reptile.countDocuments();
        const totalPages = Math.ceil(totalResults / perPage);

        res.send({
            dati: reptile,
            totalPages,
            totalResults,
            page,
        });
    } catch (err) {
        res.status(500).send();
    }
};


export const GetIDReptile = async (req, res) => {
    try {
        const id = req.params.reptileId;
        const reptile = await Reptile.findById(id)

        if (!reptile) res.status(404).send();
        else res.send(reptile);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Not Found' });
    }
};

export const GetAllReptileByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;

        const reptile = await Reptile.find({ user: userId })
            .sort({ species: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        const totalResults = await Reptile.countDocuments({ user: userId });
        const totalPages = Math.ceil(totalResults / perPage);

        if (!reptile || reptile.length === 0) {
            return res.status(404).send({ message: `No reptiles found for this person ${userId}` });
        }

        res.send({
            dati: reptile,
            totalPages,
            totalResults,
            page,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error' });
    }
};


export const PostReptile = async (req, res) => {
    try {
        const { name, species, morph, birthDate, sex, isBreeder, notes } = req.body;
        const userId = req.user.userid;

        // Controllo limite massimo
        const reptileCount = await Reptile.countDocuments({ user: userId });
        if (reptileCount >= 8) {
            return res.status(400).json({ message: 'Hai raggiunto il limite massimo di 8 animali' });
        }
        let imageUrl = '';

        if (req.file) {
            try {
                const streamifier = await import('streamifier');

                const streamUpload = (buffer) => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { resource_type: 'image' },
                            (error, result) => {
                                if (result) resolve(result);
                                else reject(error);
                            }
                        );
                        streamifier.default.createReadStream(buffer).pipe(stream);
                    });
                };

                const result = await streamUpload(req.file.buffer);
                imageUrl = result.secure_url;
                imageUrl = result.secure_url;
            } catch (err) {
                console.error('Errore upload Cloudinary:', err);
                return res.status(500).send({ message: 'Errore upload immagine' });
            }

        }

        const birthDateObject = parseDateOrNull(birthDate);
        const newReptile = new Reptile({
            _id: new mongoose.Types.ObjectId(),
            name,
            species,
            morph,
            user: userId,
            image: imageUrl,
            birthDate: birthDateObject,
            sex,
            isBreeder,
            notes,
        });

        const createdReptile = await newReptile.save();

        res.status(201).send(createdReptile);
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'Error creating reptile' });
    }
};

export const PutReptile = async (req, res) => {
    try {
        const id = req.params.reptileId;
        const { name, species, morph, sex, notes, birthDate, isBreeder } = req.body;

        let reptile = await Reptile.findById(id);

        if (!reptile) {
            return res.status(404).send({ message: 'Reptile not found' });
        }

        let imageUrl = reptile.image;

if (req.file) {
  // Carica buffer su Cloudinary
      if (reptile.image) {
        const publicId = reptile.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(console.warn);
      }

  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => error ? reject(error) : resolve(result)
    );
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  });
  imageUrl = result.secure_url;
}
        const parseDateOrNull = (value) => {
            if (!value || value === 'null') return null;
            return new Date(value);
        };

        const parseNumberOrNull = (value) => {
            if (!value || value === 'null') return null;
            return Number(value);
        };

        const birthDateObject = birthDate ? new Date(birthDate) : reptile.birthDate;

        reptile.name = name || reptile.name;
        reptile.species = species || reptile.species;
        reptile.morph = morph || reptile.morph;
        reptile.birthDate = birthDateObject;
        reptile.image = imageUrl;
        reptile.sex = sex || reptile.sex;
reptile.isBreeder = isBreeder === 'true' || isBreeder === true;
        reptile.notes = notes || reptile.notes;
        const updatedReptile = await reptile.save();

        res.send(updatedReptile);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error updating reptile' });
    }
};

export const DeleteReptile = async (req, res) => {
    try {
        const reptileId = req.params.reptileId;
        const reptile = await Reptile.findById(reptileId);
        if (!reptile) return res.status(404).send({ message: 'Reptile not found' });

        await Feeding.deleteMany({ reptile: reptileId });

        await Notification.deleteMany({ reptile: reptileId });

        await Reptile.findByIdAndDelete(reptileId);

        res.send({ message: 'Reptile and associated data successfully deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error' });
    }
};
