const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UsersModel");
const dotenv = require("dotenv");
const auth = require("../middleware/auth");
const {
  SendVerificationCode,
  SendWelcomeEmail,
} = require("../middleware/email");

dotenv.config();

//SignUp
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    //check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }
    //hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    //save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationCode,
    });
    await newUser.save();
    SendVerificationCode(newUser.email, verificationCode);

    //generate the jwt token
    const token = jwt.sign({ id: newUser._id }, process.env.JWTSECRET, {
      expiresIn: "2h",
    });

    // Add token and remove password before sending back
    newUser.token = token;
    newUser.password = undefined;

    //send the respone back
    res.status(200).json({
      success: true,
      token,
      user: newUser,
    });
  } catch (err) {
    console.error("Error while signing up:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//Login
router.post("/login", async (req, res) => {
  console.log("Inside Login Router");

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json("User Not Found");
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;
      res.status(200).json({
        success: true,
        token,
        user,
      });
    }
  } catch (error) {
    console.error("Error while signing up:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//verify
router.get("/verify", auth, async (req, res) => {
  try {
    res.status(200).send("User is authenticated");
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
});

// routes/auth.js or similar
// routes/auth.js or similar
router.post("/google-login", async (req, res) => {
  const { name, email, role } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        role,
        password: "google-oauth", // dummy password
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
      expiresIn: "2h",
    });

    user.token = token;
    user.password = undefined;

    res.status(200).json({ success: true, user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//

router.put("/update-avatar/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { avatarURL } = req.body;

    if (!avatarURL) {
      return res.status(400).json({
        success: false,
        message: "Avatar URL is required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { avatarURL });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating avatar:", err);
    res.status(500).json({
      success: false,
      message: "Server error while updating avatar",
    });
  }
});

router.put("/isPremium/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { isPremium } = req.body;

    const update = {
      isPremium: !!isPremium,
      premiumSince: !!isPremium ? new Date() : null,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Premium updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating premium status:", err);
    res.status(500).json({
      success: false,
      message: "Server error while updating premium status",
    });
  }
});

// verify the email

router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  console.log("User's code in DB:", user.verificationCode);
  console.log("Code from request:", code);

  if (user.verificationCode === code) {
    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();
    await SendWelcomeEmail(user.email, user.name);

    // Generate JWT token for immediate login after verification
    const token = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
      expiresIn: "2h",
    });
    user.token = token;
    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user,
      token,
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid verification code" });
  }
});

module.exports = router;
