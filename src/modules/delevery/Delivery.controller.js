import { DeliveryService } from '../../services/DeliveryService.js';


export class DeliveryController {
    constructor() {
        this.deliveryService = new DeliveryService();
    }

    async createDelivery(req, res) {
        try {
            const delivery = await this.deliveryService.createDelivery(req.body);
            res.status(201).json({
                success: true,
                data: delivery,
                message: 'Delivery created successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // async updateDeliveryStatus(req, res) {
    //     try {
    //         const { deliveryId } = req.params;
    //         const { status, ...updateData } = req.body;
            
    //         const delivery = await this.deliveryService.updateDeliveryStatus(
    //             deliveryId, 
    //             status, 
    //             updateData
    //         );
            
    //         res.json({
    //             success: true,
    //             data: delivery,
    //             message: 'Delivery status updated successfully'
    //         });
    //     } catch (error) {
    //         res.status(400).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }

    // async trackDelivery(req, res) {
    //     try {
    //         const { trackingNumber } = req.params;
    //         const delivery = await this.deliveryService.getDeliveryByTrackingNumber(trackingNumber);
            
    //         if (!delivery) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: 'Delivery not found'
    //             });
    //         }

    //         res.json({
    //             success: true,
    //             data: delivery
    //         });
    //     } catch (error) {
    //         res.status(500).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }
}
