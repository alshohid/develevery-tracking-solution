import { Delivery } from '../models/Delivery.js';
import { QRCodeService } from './QRCodeService.js';
import { GoogleMapsService } from './GoogleMapsService.js';
import { NotificationService } from './NotificationService.js';

export class DeliveryService {
    constructor(socketManager) {
        this.socketManager = socketManager;
        this.qrCodeService = new QRCodeService();
        this.mapsService = new GoogleMapsService();
        this.notificationService = new NotificationService();
    }

    async createDelivery(deliveryData) {
        try {
            const trackingNumber = this.generateTrackingNumber();
            const qrCode = await this.qrCodeService.generateQRCode(trackingNumber);
            
            const delivery = new Delivery({
                ...deliveryData,
                trackingNumber,
                qrCode
            });

            // Get estimated delivery time from Google Maps
            const estimatedTime = await this.mapsService.getEstimatedDeliveryTime(
                deliveryData.pickupLocation,
                deliveryData.deliveryLocation
            );
            
            delivery.estimatedDeliveryTime = estimatedTime;
            
            await delivery.save();
            
            // Send notification to sender
            await this.notificationService.sendDeliveryCreatedNotification(
                deliveryData.senderId,
                delivery
            );

            return delivery;
        } catch (error) {
            throw new Error(`Failed to create delivery: ${error.message}`);
        }
    }

    async updateDeliveryStatus(deliveryId, status, updateData = {}) {
        try {
            const delivery = await Delivery.findById(deliveryId);
            if (!delivery) {
                throw new Error('Delivery not found');
            }

            delivery.status = status;
            
            // Add to delivery history
            delivery.deliveryHistory.push({
                status,
                timestamp: new Date(),
                location: updateData.location,
                note: updateData.note
            });

            if (status === 'delivered') {
                delivery.actualDeliveryTime = new Date();
            }

            if (updateData.currentLocation) {
                delivery.currentLocation = {
                    coordinates: updateData.currentLocation,
                    timestamp: new Date()
                };
            }

            await delivery.save();

            // Broadcast status update via Socket.IO
            this.socketManager.broadcastStatusUpdate(deliveryId, status, updateData);

            // Send notifications
            await this.notificationService.sendStatusUpdateNotification(delivery, status);

            return delivery;
        } catch (error) {
            throw new Error(`Failed to update delivery status: ${error.message}`);
        }
    }

    async getDeliveryByTrackingNumber(trackingNumber) {
        return await Delivery.findOne({ trackingNumber })
            .populate('senderId receiverId deliveryPersonId');
    }

    generateTrackingNumber() {
        const prefix = 'DT';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }
}
