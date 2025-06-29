import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { DeliveryController } from '../../modules/delevery/Delivery.controller.js';
import { validateDelivery } from '../../middlewares/validateDelivery.js';

const router = express.Router();
const deliveryController = new DeliveryController();

// Create delivery with validation
router.post('/', (req, res) => {
    deliveryController.createDelivery(req, res);
});

// Get all deliveries for authenticated user
// router.get('/', authMiddleware, (req, res) => {
//     deliveryController.getUserDeliveries(req, res);
// });

// Get specific delivery
// router.get('/:deliveryId', authMiddleware, (req, res) => {
//     deliveryController.getDeliveryById(req, res);
// });

// Update delivery status (delivery person only)
// router.put('/:deliveryId/status', authMiddleware, (req, res) => {
//     deliveryController.updateDeliveryStatus(req, res);
// });

// // Update delivery location (delivery person only)
// router.put('/:deliveryId/location', authMiddleware, (req, res) => {
//     deliveryController.updateDeliveryLocation(req, res);
// });

// // Cancel delivery (sender only)
// router.delete('/:deliveryId', authMiddleware, (req, res) => {
//     deliveryController.cancelDelivery(req, res);
// });
// });

// // Get delivery history
// router.get('/:deliveryId/history', authMiddleware, (req, res) => {
//     deliveryController.getDeliveryHistory(req, res);
// });

// Generate new QR code for delivery
// router.post('/:deliveryId/qr-code', authMiddleware, (req, res) => {
//     deliveryController.generateQRCode(req, res);
// });

export { router as deliveryRoutes };