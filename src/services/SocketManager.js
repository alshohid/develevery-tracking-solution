export class SocketManager {
    constructor(io) {
        this.io = io;
        this.connectedUsers = new Map();
    }

    initialize() {
        this.io.on('connection', (socket) => {
            console.log('User connected:', socket.id);
            
            socket.on('join-delivery', (deliveryId) => {
                this.joinDeliveryRoom(socket, deliveryId);
            });

            socket.on('update-location', (data) => {
                this.updateDeliveryLocation(socket, data);
            });

            socket.on('disconnect', () => {
                this.handleDisconnect(socket);
            });
        });
    }

    joinDeliveryRoom(socket, deliveryId) {
        socket.join(`delivery_${deliveryId}`);
        console.log(`Socket ${socket.id} joined delivery room: ${deliveryId}`);
    }

    updateDeliveryLocation(socket, data) {
        const { deliveryId, location, deliveryPersonId } = data;
        
        // Broadcast location update to all users tracking this delivery
        socket.to(`delivery_${deliveryId}`).emit('location-update', {
            deliveryId,
            location,
            timestamp: new Date()
        });
    }

    broadcastStatusUpdate(deliveryId, status, data = {}) {
        this.io.to(`delivery_${deliveryId}`).emit('status-update', {
            deliveryId,
            status,
            timestamp: new Date(),
            ...data
        });
    }

    sendNotification(userId, notification) {
        this.io.to(`user_${userId}`).emit('notification', notification);
    }

    handleDisconnect(socket) {
        console.log('User disconnected:', socket.id);
        // Clean up user data
        this.connectedUsers.delete(socket.id);
    }
}