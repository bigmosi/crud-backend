const express = require('express');
const multer = require('multer');
const path = require('path');
const restaurantController = require('../controller/restaurantController');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Create multer instance with storage configuration
const upload = multer({ storage });

router.get('/restaurants', restaurantController.getAllRestaurants);
router.get('/restaurants/:id', restaurantController.getRestaurantById);
router.post('/restaurants', upload.single('image'), restaurantController.createRestaurant);
router.put('/restaurants/:id', upload.single('image'), restaurantController.updateRestaurant);
router.delete('/restaurants/:id', restaurantController.deleteRestaurant);

module.exports = router;
