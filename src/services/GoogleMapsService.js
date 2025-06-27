import { Client } from '@googlemaps/google-maps-services-js';

export class GoogleMapsService {
    constructor() {
        this.client = new Client({});
        this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    }

    async getEstimatedDeliveryTime(origin, destination) {
        try {
            const response = await this.client.distancematrix({
                params: {
                    origins: [`${origin.coordinates.lat},${origin.coordinates.lng}`],
                    destinations: [`${destination.coordinates.lat},${destination.coordinates.lng}`],
                    key: this.apiKey,
                    units: 'metric',
                    departure_time: 'now',
                    traffic_model: 'best_guess'
                }
            });

            const duration = response.data.rows[0].elements[0].duration_in_traffic?.value ||
                           response.data.rows[0].elements[0].duration.value;

            // Add buffer time (30 minutes) for pickup and delivery
            const estimatedSeconds = duration + (30 * 60);
            const estimatedTime = new Date(Date.now() + (estimatedSeconds * 1000));

            return estimatedTime;
        } catch (error) {
            throw new Error(`Google Maps API error: ${error.message}`);
        }
    }

    async getOptimizedRoute(waypoints) {
        try {
            const response = await this.client.directions({
                params: {
                    origin: waypoints[0],
                    destination: waypoints[waypoints.length - 1],
                    waypoints: waypoints.slice(1, -1),
                    optimize: true,
                    key: this.apiKey
                }
            });

            return response.data;
        } catch (error) {
            throw new Error(`Route optimization error: ${error.message}`);
        }
    }

    async geocodeAddress(address) {
        try {
            const response = await this.client.geocode({
                params: {
                    address,
                    key: this.apiKey
                }
            });

            if (response.data.results.length === 0) {
                throw new Error('Address not found');
            }

            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng,
                formatted_address: response.data.results[0].formatted_address
            };
        } catch (error) {
            throw new Error(`Geocoding error: ${error.message}`);
        }
    }
}
