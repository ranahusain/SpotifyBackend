const express = require("express");
const router = express.Router();
const Song = require("../models/SongsModel");

router.post("/addsong", async (req, res) => {
  try {
    const {
      songname,
      artistName,
      artistImageURL,
      imageURL,
      songURL,
      albumName,
      albumImageURL,
    } = req.body;

    const existingSong = await Song.findOne({ songname });

    if (existingSong) {
      return res.status(409).json({
        success: false,
        message: "Song already exists with this name",
      });
    }

    const newSong = new Song({
      songname,
      artist: {
        name: artistName,
        imageURL: artistImageURL,
      },
      album: {
        name: albumName || "",
        imageURL: albumImageURL || "",
      },
      imageURL,
      songURL,
    });

    await newSong.save();

    res.status(200).json({
      success: true,
      message: "Song added successfully",
      song: newSong,
    });
  } catch (error) {
    console.error("Error while adding song:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/getsong", async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//get the artist details
router.get("/artist/:artistname", async (req, res) => {
  try {
    const artistname = decodeURIComponent(req.params.artistname);
    const songs = await Song.find({ "artist.name": artistname });

    if (!songs.length) {
      return res.status(404).json({ message: "Artist not found" });
    }

    const artist = songs[0].artist;
    res.json({ artist, songs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
