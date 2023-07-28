const Restaurant = require('../models/restaurantModel');

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    const transformedRestaurants = restaurants.map((restaurant) => {
      const { _id, ...rest } = restaurant.toObject();
      return {
        id: _id.toString(),
        ...rest,
      };
    });
    console.log(transformedRestaurants);
    res.status(200).json(transformedRestaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    let restaurant;

    if (id.length === 24) {
      restaurant = await Restaurant.findById(id);
    } else {
      restaurant = await Restaurant.findOne({ _id: id });
    }

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const { name, cuisineType, location } = req.body;
    const imageFile = req.file;

    // Create a new restaurant instance
    const restaurant = new Restaurant({
      name,
      cuisineType,
      location,
      image: imageFile.filename, // Store the filename in the 'image' field
    });

    // Save the restaurant to the database
    const newRestaurant = await restaurant.save();

    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cuisineType, location } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      { name, cuisineType, location, image: imagePath },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndDelete(id);
    if (!restaurant) {
      return res
        .status(404)
        .json({ message: `Cannot find any restaurant with ID ${id}` });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
