const express = require('express');
const router = express.Router();

// Mock car data
const cars = [
    {
        id: 1,
        name: 'Premium Account',
        price: 1500,
        description: 'Premium account with special features'
    },
    {
        id: 2,
        name: 'Standard Account',
        price: 800,
        description: 'Standard account with basic features'
    }
];

// Get all cars
router.get('/', (req, res) => {
    res.json(cars);
});

// Get car by id
router.get('/:id', (req, res) => {
    const car = cars.find(c => c.id === parseInt(req.params.id));
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
});

module.exports = router;
