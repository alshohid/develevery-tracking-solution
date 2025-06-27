import { body, param, query, validationResult } from 'express-validator';

// Helper function to handle validation errors
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Auth validation rules
export const validateAuth = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Valid phone number is required'),
    handleValidationErrors
];

// User validation rules
export const validateUser = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Valid phone number is required'),
    body('address.street')
        .optional()
        .trim()
        .isLength({ min: 5 })
        .withMessage('Street address must be at least 5 characters long'),
    body('address.city')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('City must be at least 2 characters long'),
    body('role')
        .optional()
        .isIn(['customer', 'delivery_person', 'admin'])
        .withMessage('Invalid role'),
    handleValidationErrors
];

// Delivery validation rules
export const validateDelivery = [
    body('pickupLocation.address')
        .notEmpty()
        .trim()
        .withMessage('Pickup address is required'),
    body('pickupLocation.coordinates.lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Valid pickup latitude is required'),
    body('pickupLocation.coordinates.lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Valid pickup longitude is required'),
    body('deliveryLocation.address')
        .notEmpty()
        .trim()
        .withMessage('Delivery address is required'),
    body('deliveryLocation.coordinates.lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Valid delivery latitude is required'),
    body('deliveryLocation.coordinates.lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Valid delivery longitude is required'),
    body('receiverId')
        .isMongoId()
        .withMessage('Valid receiver ID is required'),
    body('packageDetails.description')
        .optional()
        .trim()
        .isLength({ min: 5 })
        .withMessage('Package description must be at least 5 characters long'),
    body('packageDetails.weight')
        .optional()
        .isFloat({ min: 0.1 })
        .withMessage('Package weight must be greater than 0'),
    handleValidationErrors
];

// Status update validation
export const validateStatusUpdate = [
    body('status')
        .isIn(['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'])
        .withMessage('Invalid status'),
    body('note')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Note must be less than 500 characters'),
    body('currentLocation.lat')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Valid latitude is required'),
    body('currentLocation.lng')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Valid longitude is required'),
    handleValidationErrors
];

// Location update validation
export const validateLocationUpdate = [
    body('coordinates.lat')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Valid latitude is required'),
    body('coordinates.lng')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Valid longitude is required'),
    handleValidationErrors
];

// Tracking number validation
export const validateTrackingNumber = [
    param('trackingNumber')
        .matches(/^DT\d{8}[A-Z0-9]{4}$/)
        .withMessage('Invalid tracking number format'),
    handleValidationErrors
];
