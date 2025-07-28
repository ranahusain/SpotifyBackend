const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default:
      "https://bkbfkacpgdxbbunehdgi.supabase.co/storage/v1/object/public/songs/1753337121808.png",
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  premiumSince: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verficationToken: String,
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verficationTokenExpiresAt: Date,
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
