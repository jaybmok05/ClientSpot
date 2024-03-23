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
import { protect } from '../middleware/userAuthMiddleware.js';


const  router = express.Router();
/*Connect routes to the associated function controllers*/
router.post('/sendEmail', sendCodeToEmail);
router.post('/login', loginUser);
router.post('/signup', signUpUser);
router.route('/logout').post(protect, logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/sendOtp', sendPasswordResetOTP);
router.put('/updatePassword', updatePasswordWithOTP);
router.route('/:id').delete(protect, deleteUser);


export default router;