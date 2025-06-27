// Auth middleware
import jwt from 'jsonwebtoken';
import { User } from "../modules/user/user.model.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = extractTokenFromHeader(req);
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token - user not found'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

// Extract token from Authorization header
const extractTokenFromHeader = (req) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return null;
    }

    // Support both "Bearer token" and "token" formats
    if (authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    
    return authHeader;
};

// Role-based access control middleware
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};

// Admin only middleware
export const requireAdmin = requireRole('admin');

// Delivery person only middleware
export const requireDeliveryPerson = requireRole('delivery_person');

// Admin or delivery person middleware
export const requireAdminOrDeliveryPerson = requireRole('admin', 'delivery_person');

// Optional auth middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
    try {
        const token = extractTokenFromHeader(req);
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            
            if (user && user.isActive) {
                req.user = user;
                req.userId = user._id;
            }
        }
        
        next();
    } catch (error) {
        // Ignore token errors in optional auth
        next();
    }
};