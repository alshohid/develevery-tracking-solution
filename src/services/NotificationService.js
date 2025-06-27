import admin from 'firebase-admin';
import { User } from '../models/User.js';

export class NotificationService {
    constructor() {
        // Initialize Firebase Admin SDK
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                })
            });
        }
        this.messaging = admin.messaging();
    }

    async sendPushNotification(userId, title, body, data = {}) {
        try {
            const user = await User.findById(userId);
            if (!user || !user.fcmToken) {
                console.log('User FCM token not found');
                return;
            }

            const message = {
                notification: {
                    title,
                    body
                },
                data: {
                    ...data,
                    timestamp: new Date().toISOString()
                },
                token: user.fcmToken
            };

            await this.messaging.send(message);
            console.log('Push notification sent successfully');
        } catch (error) {
            console.error('Push notification error:', error);
        }
    }

    async sendDeliveryCreatedNotification(senderId, delivery) {
        await this.sendPushNotification(
            senderId,
            'Delivery Created',
            `Your delivery ${delivery.trackingNumber} has been created and is pending pickup.`,
            { 
                type: 'delivery_created',
                deliveryId: delivery._id.toString(),
                trackingNumber: delivery.trackingNumber
            }
        );
    }

    async sendStatusUpdateNotification(delivery, status) {
        const statusMessages = {
            picked_up: 'Your package has been picked up and is on its way!',
            in_transit: 'Your package is in transit.',
            out_for_delivery: 'Your package is out for delivery.',
            delivered: 'Your package has been delivered successfully!',
            cancelled: 'Your delivery has been cancelled.'
        };

        // Notify sender
        await this.sendPushNotification(
            delivery.senderId,
            'Delivery Update',
            statusMessages[status] || `Delivery status updated to ${status}`,
            {
                type: 'status_update',
                deliveryId: delivery._id.toString(),
                status,
                trackingNumber: delivery.trackingNumber
            }
        );

        // Notify receiver
        await this.sendPushNotification(
            delivery.receiverId,
            'Delivery Update',
            statusMessages[status] || `Delivery status updated to ${status}`,
            {
                type: 'status_update',
                deliveryId: delivery._id.toString(),
                status,
                trackingNumber: delivery.trackingNumber
            }
        );
    }

    async sendLocationUpdateNotification(userId, delivery, location) {
        await this.sendPushNotification(
            userId,
            'Location Update',
            `Your delivery ${delivery.trackingNumber} location has been updated.`,
            {
                type: 'location_update',
                deliveryId: delivery._id.toString(),
                location: JSON.stringify(location)
            }
        );
    }
}
