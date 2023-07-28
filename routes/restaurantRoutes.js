const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const restaurantController = require('../controller/restaurantController');

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

router.get('/restaurants', authMiddleware, restaurantController.getAllRestaurants);
router.get('/restaurants/:id', authMiddleware, restaurantController.getRestaurantById);
router.post('/restaurants', upload.single('image'), authMiddleware, restaurantController.createRestaurant);
router.put('/restaurants/:id', upload.single('image'), authMiddleware, restaurantController.updateRestaurant);
router.delete('/restaurants/:id', authMiddleware, restaurantController.deleteRestaurant);

module.exports = router;
