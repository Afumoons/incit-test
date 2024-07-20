import { Router } from 'express';
import {
    register, login, logout, googleAuth, googleAuthCallback, googleAuthRedirect,
    //facebookAuth, facebookAuthCallback, facebookAuthRedirect
} from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback, googleAuthRedirect);

// Facebook OAuth routes
// router.get('/facebook', facebookAuth);
// router.get('/facebook/callback', facebookAuthCallback, facebookAuthRedirect);

export default router;
