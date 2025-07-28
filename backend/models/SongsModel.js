const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SongSchema = new Schema({
  songname: {
    type: String,
    required: true,
    trim: true,
  },
  artist: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    imageURL: {
      type: String,
      required: true,
      trim: true,
    },
  },
  album: {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    imageURL: {
      type: String,
      trim: true,
      default: "",
    },
  },
  imageURL: {
    type: String,
    required: true,
    trim: true,
  },
  songURL: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SongModel = model("Song", SongSchema);

module.exports = SongModel;
