import asyncHandler from 'express-async-handler';
import sendEmail from '../utils/sendEmail.js';
import generateUniqueCode from '../utils/generateUniqueCode.js';
import User from '../models/user.js';
import generateAuthToken from '../utils/generateAuthToken.js';
import Codes from '../models/code.js';
import OTP from '../models/otp.js';


// @desc  Login User and set token
// route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }
        // If the user does not exist, return an error
        if (!user) {
            return res.status(404).json({ message: "User not found. Please sign up." });
        }

        // Check if the provided password matches the user's password
        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid email or password. Please try again." });
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
    console.log(code);
    try {
        if (!email || !code) {
            return res.status(400).json({ message: "Email and Code are required to signup" });
        }
        // Find the latest code associated with the email
        const latestCode = await Codes.findOne({ email }).sort({ createdAt: -1 });

        if (!latestCode) {
            return res.status(400).json({ message: "Please get generated code." });
        }
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

        if (latestCode.code !== code) {
            throw new Error('Invalid code. Please check your credentials.');
        }
      
        // Check if the code has expired
        const expirationDuration = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
        if (Date.now() - latestCode.createdAt.getTime() > expirationDuration) {
            throw new Error('Verification code has expired. Please request a new one.');
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

        // Delete the verification code
        await Codes.deleteOne({ _id: latestCode._id });

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


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
  
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
  
      const updatedUser = await user.save();
  
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });


// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin (if applicable)
const deleteUser = asyncHandler(async (req, res) => {
    try {
  
      // Find the user by ID and delete it
      const user = await User.findByIdAndDelete(req.params.id);
  
      if (user) {
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});


// @desc    Send otp user for password reset
// @route   PUT /api/users/sendOtp
// sendPasswordResetOTP handler
const sendPasswordResetOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
        
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  // Generate a unique OTP
  const OTPCode = generateUniqueCode();

  // Calculate expiration time (e.g., 5 minutes from now)
  const expirationTime = new Date(Date.now() + 5 * 60 * 1000);

  try { 
    // Save OTP to the database
    await OTP.create({ email, code: OTPCode, expiresAt: expirationTime });

    // Compose email
    const subject = 'Password Reset OTP';
    const text = `Your password reset OTP is: ${OTPCode}. This OTP is valid for 5 minutes.`;

    // Send email with OTP
    await sendEmail(email, subject, text);

    res.status(200).json({ message: 'Password reset OTP sent successfully' });
  } catch (error) {
    console.error('Error sending password reset OTP:', error);
    res.status(500).json({ message: 'Error sending password reset OTP' });
  }
});


// @desc    Update user password
// @route   PUT /api/users/updatePassword
// @access  Private
const updatePasswordWithOTP = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
      // Find the OTP document in the database
      const otpDocument = await OTP.findOne({ email, code: otp });
      
      // Check if OTP is valid and not expired
      if (!otpDocument || otpDocument.expiresAt < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
    
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update the user's password
      user.password = newPassword || user.password;
      await user.save();

      // Delete the OTP document from the database
      await OTP.deleteOne({ _id: otpDocument._id });

      res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
      console.error('Error updating password with OTP:', error);
      res.status(500).json({ message: 'Error updating password with OTP' });
  }
});


/******************/
/* helper functions*/
/******************/
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


// Controller function to send verification code to the user's email
const sendCodeToEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ msg: 'Email is required' });
    }
    try {
        // Generate a unique verification code
        const code = generateUniqueCode();
    
        // Save the verification code in the database
        const signupCodeInfo = new Codes({ email, code })
        await signupCodeInfo.save();
    
        // Compose email
        const subject = 'Verification code to sign up to clientSpot';
        const text = `Your verification code is: ${code}, please sign up within three days before code expires`;
    
        // Send email using sendEmail function
        await sendEmail(email, subject, text);
    
        res.status(200).json({ msg: 'Email sent successfully' });
      } catch (error) {
        console.error('Error sending verification code:', error);
        throw new Error('Failed to send verification code.');
      }
});


export {
    loginUser,
    signUpUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    sendCodeToEmail,
    sendPasswordResetOTP,
    updatePasswordWithOTP,
    deleteUser
};