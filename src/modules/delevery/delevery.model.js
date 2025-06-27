import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
    trackingNumber: {
        type: String,
        required: true,
        unique: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deliveryPersonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    pickupLocation: {
        address: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    deliveryLocation: {
        address: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    currentLocation: {
        coordinates: {
            lat: Number,
            lng: Number
        },
        timestamp: Date
    },
    qrCode: String,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    packageDetails: {
        description: String,
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number
        }
    },
    deliveryHistory: [{
        status: String,
        timestamp: Date,
        location: {
            lat: Number,
            lng: Number
        },
        note: String
    }]
}, {
    timestamps: true
});

export const Delivery = mongoose.model('Delivery', deliverySchema);