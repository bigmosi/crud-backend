const express = require('express');
const multer = require('multer');
const path = require('path');
const Restaurant = require('../models/restaurantModel');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({});
    res.status(200).json(restaurants);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Check if the provided id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid restaurant ID' });
      }
  
      const restaurant = await Restaurant.findById(id);
  
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      res.status(200).json(restaurant);
    } catch (error) {
      next(error);
    }
  });
  
  router.post('/', upload.single('image'), async (req, res, next) => {
    try {
      const { name, cuisineType, location } = req.body;
      const imageFile = req.file;
  
      const restaurant = new Restaurant({
        name,
        cuisineType,
        location,
        image: imageFile.filename,
      });
  
      const newRestaurant = await restaurant.save();
      res.status(201).json(newRestaurant);
    } catch (error) {
      next(error);
    }
  });  

router.put('/:id',authMiddleware.authenticateUser, upload.single('image'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, cuisineType, location } = req.body;
    const imagePath = req.file ? req.file.filename : null;
    const userId = req.user._id;
    console.log(userId);

    const restaurant = await Restaurant.findById(id);
    if (!restaurant || restaurant.owner.toString() !== userId.toString()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    restaurant.name = name;
    restaurant.cuisineType = cuisineType;
    restaurant.location = location;
    if (imagePath) {
      restaurant.image = imagePath;
    }

    const updatedRestaurant = await restaurant.save();
    res.json(updatedRestaurant);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByIdAndDelete(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ message: 'Restaurant deleted successfully', data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
