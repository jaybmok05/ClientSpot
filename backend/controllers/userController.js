import asyncHandler from 'express-async-handler';
import sendEmail from '../utils/sendEmail.js';
import generateUniqueCode from '../utils/generateUniqueCode.js';
import User from '../models/user.js';
import generateAuthToken from '../utils/generateAuthToken.js';


// @desc  Login User and set token
// route POST /api/users/login
// @access Public
// @desc  Login User and set token
// route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });

        // If the user does not exist, return an error
        if (!user && !(await user.matchPassword(password))) {
            return res.status(404).json({ message: "Error logging in. Check email or password" });
        }

        // If the email and password are valid, generate and set a JWT token for authentication
        const token = generateAuthToken(res, user._id);

        res.status(200).json({ message: "Logged in successfully.", token});
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: "Internal server error." });
    }
});


// @desc  Sign up a new user
// route POST /api/users/signup
// @access Public
const signUpUser = asyncHandler(async (req, res) => {
    const { email, firstName, lastName, password1, password2, code } = req.body;

    try {

        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address." });
        }

        // check for existing user in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        if (!codeMap.has(email)) {
            return res.status(400).json({ message: "Invalid email or code." });
        }

        // Retrieve the code and its associated timestamp from the codeMap
        const { code: generatedCode, timestamp } = codeMap.get(email);

        // Check if the code has expired (e.g., expired after three days minutes)
        const expirationDuration = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
        const currentTime = Date.now();

        if (currentTime - timestamp > expirationDuration) {
            // Code has expired
            return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
        }

        // Check if the provided code matches the generated code
        if (generatedCode !== code) {
            return res.status(400).json({ message: "Invalid code. Please check your credentials." });
        }

        const passwordError = validatePassword(password1);
        if (passwordError) {
            return res.status(400).json({ message: passwordError });
        }

        // Check if passwords match
        if (password1 !== password2) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Create the new user
        const newUser = new User({ email, firstName, lastName, password: password1 });
        await newUser.save();
        codeMap.delete(email);

        //generate and set a JWT token for authentication
        const token = generateAuthToken(res, newUser._id);
        res.status(200).json({ message: "Signed up successfully.", token });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ message: "Internal server error." });
    }
});



// @desc  Login User user/set token
// route POST /api/users/logout
// @access Private, you have to login first to logout
// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};


// @desc  GET user profile
// route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler((req, res) => {
    res.status(200).json({ message: "Logging in usetrrrr"});
});

// @desc  Update user profile
// route PUT /api/users/profile
// @access Public
const updateUserProfile = asyncHandler((req, res) => {
    res.status(200).json({ message: "Logging in user"});
});



// Function to validate password
const validatePassword = (password) => {
    const special_characters = new Set('!@&?%*');

    if (!(7 <= password.length <= 15)) {
        return "Password must be between 7 and 15 characters.";
    } else if (!password.match(/[A-Z]/)) {
        return "Password must contain at least one uppercase letter.";
    } else if (!password.match(/[a-z]/)) {
        return "Password must contain at least one lowercase letter.";
    } else if (!password.match(/[0-9]/)) {
        return "Password must contain at least one digit.";
    } else if (![...password].some(char => special_characters.has(char))) {
        return "Password must contain at least one special character (!@&?%*).";
    } else {
        return null;
    }
};

const codeMap = new Map();
// Controller function to send verification code to the user's email
const sendCodeToEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ msg: 'Email is required' });
    }

    try {
        // Generate a unique verification code
        const code = generateUniqueCode().toUpperCase();

        // Store the code and its associated timestamp in the map
        const timestamp = Date.now();
        codeMap.set(email, { code, timestamp });

        // Compose email
        const subject = 'Verification code to sign up to clientSpot';
        const text = `Your verification code is: ${code}, please sign up within three days before code expires`;

        // Send email using sendEmail function
        await sendEmail(email, subject, text);
        
        res.status(200).json({ msg: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ msg: 'Error sending email' });
    }
});


export {
    loginUser,
    signUpUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    sendCodeToEmail
};