import { Router } from 'express';
import {
    register, login, logout, protectedData,
    googleAuth, googleAuthCallback, googleAuthRedirect,
    facebookAuth, facebookAuthCallback, facebookAuthRedirect,
    verifyEmail,
    resendVerificationEmail
} from '../controllers/authController';
import { changePassword, getAllUsers, getProfileData, getTotalUserStatistics, updateProfile } from '../controllers/userController';
import { authenticateToken, ensureAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected-data', protectedData);
router.post('/logout', logout);
router.get('/users', getAllUsers);
router.get('/dashboard-statistic', getTotalUserStatistics);
router.post('/get-profile', getProfileData);
router.put('/change-profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification-email', resendVerificationEmail);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback, googleAuthRedirect);

// Facebook OAuth routes
router.get('/facebook', facebookAuth);
router.get('/facebook/callback', facebookAuthCallback, facebookAuthRedirect);

export default router;
