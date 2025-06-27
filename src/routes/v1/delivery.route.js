import express from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { DeliveryController } from '../../modules/delevery/Delivery.controller.js';

const router = express.Router();
const deliveryController = new DeliveryController();

// All delivery routes require authentication
// router.use(authMiddleware);

// Create new delivery
// router.post('/', validateDelivery, (req, res) => {
//     deliveryController.createDelivery(req, res);
// });
router.post('/', (req, res) => {
    deliveryController.createDelivery(req, res);
});


// Get all deliveries for authenticated user
// router.get('/', (req, res) => {
//     deliveryController.getUserDeliveries(req, res);
// });

// Get specific delivery
// router.get('/:deliveryId', (req, res) => {
//     deliveryController.getDeliveryById(req, res);
// });

// Update delivery status (delivery person only)
// router.put('/:deliveryId/status', (req, res) => {
//     deliveryController.updateDeliveryStatus(req, res);
// });

// // Update delivery location (delivery person only)
// router.put('/:deliveryId/location', (req, res) => {
//     deliveryController.updateDeliveryLocation(req, res);
// });

// // Cancel delivery (sender only)
// router.delete('/:deliveryId', (req, res) => {
//     deliveryController.cancelDelivery(req, res);
// });

// // Get delivery history
// router.get('/:deliveryId/history', (req, res) => {
//     deliveryController.getDeliveryHistory(req, res);
// });

// // Generate new QR code for delivery
// router.post('/:deliveryId/qr-code', (req, res) => {
//     deliveryController.generateQRCode(req, res);
// });

export { router as deliveryRoutes };