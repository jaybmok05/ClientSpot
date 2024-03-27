import express from 'express';
import {
    loginUser,
    signUpUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    sendCodeToEmail,
    sendPasswordResetOTP,
    updatePasswordWithOTP,
    deleteUser
} from '../controllers/userController.js';
import { protect, isAdmin } from '../middleware/userAuthMiddleware.js';


const  router = express.Router();
/*Connect routes to the associated function controllers*/
router.post('/admin/signupCode', protect, isAdmin, sendCodeToEmail);
router.post('/login', loginUser);
router.post('/signup', signUpUser);
router.route('/logout').post(protect, logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/sendOtp', sendPasswordResetOTP);
router.put('/updatePassword', updatePasswordWithOTP);
router.delete('/admin/:id', protect, isAdmin, deleteUser);


export default router;