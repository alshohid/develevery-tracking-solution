import QRCode from 'qrcode';

export class QRCodeService {
    async generateQRCode(trackingNumber) {
        try {
            const qrCodeData = {
                trackingNumber,
                url: `${process.env.CLIENT_URL}/track/${trackingNumber}`,
                timestamp: new Date().toISOString()
            };

            const qrCodeString = await QRCode.toDataURL(JSON.stringify(qrCodeData), {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            return qrCodeString;
        } catch (error) {
            throw new Error(`QR Code generation failed: ${error.message}`);
        }
    }

    // async generateQRCodeForDelivery(deliveryId) {
    //     try {
    //         const delivery = await Delivery.findById(deliveryId);
    //         if (!delivery) {
    //             throw new Error('Delivery not found');
    //         }

    //         return await this.generateQRCode(delivery.trackingNumber);
    //     } catch (error) {
    //         throw new Error(`Failed to generate QR code for delivery: ${error.message}`);
    //     }
    // }
}