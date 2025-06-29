import express from 'express';
import { deliveryRoutes } from './delivery.route.js';



const router = express.Router();


router.use('/deliveries', deliveryRoutes);



router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API v1 is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

export default router;