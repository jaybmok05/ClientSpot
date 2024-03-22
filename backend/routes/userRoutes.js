import express from 'express';
import {
    loginUser,
    signUpUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    sendCodeToEmail
} from '../controllers/userController.js';


const  router = express.Router();
/*Connect routes to the associated function controllers*/
router.post('/sendEmail', sendCodeToEmail);
router.post('/login', loginUser);
router.post('/signup', signUpUser);
router.post('/logout', logoutUser);
router.route('/profile').get(getUserProfile).put(updateUserProfile);


export default router;