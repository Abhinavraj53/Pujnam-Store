const jwt = require('jsonwebtoken');
const User = require('../models/User');

const parseCookies = (cookieHeader = '') => {
    return cookieHeader
        .split(';')
        .map((part) => part.trim())
        .filter(Boolean)
        .reduce((acc, part) => {
            const separatorIndex = part.indexOf('=');
            if (separatorIndex === -1) return acc;
            const key = part.slice(0, separatorIndex).trim();
            const value = decodeURIComponent(part.slice(separatorIndex + 1).trim());
            acc[key] = value;
            return acc;
        }, {});
};

const getTokenFromRequest = (req) => {
    const authHeaderToken = req.header('Authorization')?.replace('Bearer ', '');
    if (authHeaderToken) return authHeaderToken;
    const cookies = parseCookies(req.headers.cookie || '');
    return cookies.auth_token || null;
};

const auth = async (req, res, next) => {
    try {
        const token = getTokenFromRequest(req);

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid token. User not found.' });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Access denied. Admin only.' });
            }
            next();
        });
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed.' });
    }
};

module.exports = { auth, adminAuth, getTokenFromRequest };
