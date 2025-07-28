const express = require("express");
const router = express.Router();
const Playlist = require("../models/PlaylistModel");
const auth = require("../middleware/auth");

router.post("/playlists", async (req, res) => {
  try {
    const { name, imageURL, owner, songs } = req.body;

    const newplaylist = new Playlist({
      name,
      imageURL,
      owner,
      songs,
    });

    await newplaylist.save();

    await newplaylist.populate("owner songs"); //get the info of owner that is user and songs that is song in other table

    res.status(200).json({
      success: true,
      message: "Song added successfully",
      playlist: newplaylist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add a song

router.post("/playlists/add", async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Optional: Prevent duplicate songs
    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    const updatedPlaylist = await Playlist.findById(playlistId).populate(
      "owner songs"
    );

    res.status(200).json({
      success: true,
      message: "Song added to playlist",
      playlist: updatedPlaylist,
    });
  } catch (error) {
    console.error("Error in adding songs to playlist", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/getplaylists", auth, async (req, res) => {
  const userId = req.user.id; // from JWT token
  try {
    const playlist = await Playlist.find({
      owner: userId,
    }).populate("owner songs");

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

//get playlist by id

router.get("/playlist/:id", async (req, res) => {
  const playlist = await Playlist.findById(req.params.id)
    .populate("songs")
    .populate("owner");
  res.json(playlist);
});

module.exports = router;
