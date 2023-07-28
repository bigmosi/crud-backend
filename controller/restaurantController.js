const Restaurant = require('../models/restaurantModel');

// Get all restaurants for the authenticated user
exports.getAllRestaurants = async (req, res) => {
  try {
    const userId = req.user.userId;
    const restaurants = await Restaurant.find({ user: userId });
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a restaurant by ID for the authenticated user
exports.getRestaurantById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ _id: id, user: userId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    // ... Send the restaurant data
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a restaurant for the authenticated user
exports.createRestaurant = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, cuisineType, location } = req.body;
    const imageFile = req.file;

    const restaurant = new Restaurant({
      name,
      cuisineType,
      location,
      image: imageFile.filename,
      user: userId, // Associate the restaurant with the authenticated user
    });

    const newRestaurant = await restaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a restaurant for the authenticated user
exports.updateRestaurant = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { name, cuisineType, location } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { _id: id, user: userId },
      { name, cuisineType, location, image: imagePath },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found or not updated' });
    }

    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a restaurant for the authenticated user
exports.deleteRestaurant = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const restaurant = await Restaurant.findOneAndDelete({ _id: id, user: userId });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found or not deleted' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
