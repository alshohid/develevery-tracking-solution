
import express from 'express';
import { deliveryRoutes } from './delivery.route.js';



const router = express.Router();


router.use('/deliveries', deliveryRoutes);


// Health check route
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API v1 is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});