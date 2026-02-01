import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/generateToken.js";
import { sendResetEmail } from "../utils/sendResetEmail.js";

export const register = async (req, res) => {
  try {
    const { name, location, email, password } = req.body;

    //Sanitize the data
    if (!name.trim() || !location.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    //Checking email is in correct format or not
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (pattern.test(email) === false) {
      return res.status(400).json({ message: "Invalid Email!" });
    }
    // Now check if the user already exists in the database or not
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered!" });
    }
    //Proceed if user is new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      location,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        message: "Registration successfull",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          location: newUser.location,
        },
      });
    }
  } catch (error) {
    console.log("Error in authController (register)", error.message);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //checks and validation
    if (!email.trim() || !password.trim()) {
      return res.status(400).json({ message: "Both fields are required!" });
    }
    //check if email is valid
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (pattern.test(email) === false) {
      return res.status(400).json({ message: "Invalid Email!" });
    }
    //check if user exists or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
    // Now after all checks, proceed

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }
    // password is correct. Login and generate token
    generateToken(user._id, res);
    res.status(200).json({
      message: "Login Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
      },
    });
  } catch (error) {
    console.log("Error in authController (login)", error.message);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.log("Error in authController (logout)", error.message);
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

      await user.save({ validateBeforeSave: false });

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      // fire-and-forget email
      sendResetEmail(user.email, resetUrl).catch((err) =>
        console.error("Reset email failed:", err),
      );
    }

    //respond Last, always same message
    return res.status(200).json({
      message: "If an account exists, a password reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log("Error in authController (resetPassword)", error.message);
    res.status(500).json({ message: "Internal server error!" });
  }
};
