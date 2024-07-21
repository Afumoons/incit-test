import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: string | object;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        console.log('No token provided');
        return res.status(401).send('Access denied');
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = verified;
        console.log('Token verified:', verified);
        next();
    } catch (err) {
        console.log('Invalid token');
        res.status(400).send('Invalid token');
    }
};

const ensureAuthenticated = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('You need to log in to access this resource');
};

export { authenticateToken, ensureAuthenticated };
