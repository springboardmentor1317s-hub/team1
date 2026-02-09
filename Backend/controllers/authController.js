const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// -------------------- REGISTER --------------------
exports.register = async (req, res) => {
  try {
    const { name, email, password, college, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      college,
      role,
      isVerified: true // mark verified since no OTP flow
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`${key}:`, error.errors[key].message);
      });
    }
    res.status(500).json({ error: error.message || 'Server error. Please try again later.' });
  }
};

// -------------------- LOGIN --------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists - explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      role: user.role
    };

    res.status(200).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

// -------------------- GET PROFILE --------------------
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

// -------------------- UPDATE PROFILE --------------------
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name && !email) {
      return res.status(400).json({ error: 'Please provide name or email to update' });
    }

    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user.id } 
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message || 'Server error. Please try again later.' });
  }
};

// -------------------- CHANGE PASSWORD --------------------
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Please provide both old and new password' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: error.message || 'Server error. Please try again later.' });
  }
};

// -------------------- GET ALL USERS (Admin) --------------------
exports.getAllUsers = async (req, res) => {
  try {
    let query = {};

    if (req.query.search) {
      query.$or = [
        { name: new RegExp(req.query.search, 'i') },
        { email: new RegExp(req.query.search, 'i') },
        { college: new RegExp(req.query.search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('-password -resetToken -resetTokenExpiry -passwordChangedAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { users, total: users.length }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// -------------------- GET USER BY ID (Admin) --------------------
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select('-password -resetToken -resetTokenExpiry -passwordChangedAt');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

// -------------------- DELETE USER (Admin) --------------------
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// -------------------- FORGOT PASSWORD --------------------
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const { sendPasswordResetEmail } = require('../utils/emailService');
    const emailResult = await sendPasswordResetEmail(user, resetLink);

    if (emailResult.success) {
      return res.status(200).json({ 
        message: "Password reset email sent successfully. Please check your inbox." 
      });
    } else {
      console.log('⚠️ Email not sent:', emailResult.message || emailResult.error);
      return res.status(200).json({ 
        message: "Password reset initiated. If email is configured, you will receive instructions shortly." 
      });
    }
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

// -------------------- RESET PASSWORD --------------------
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    const jwtToken = generateToken(user._id);

    res.status(200).json({
      message: "Password reset successful",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
