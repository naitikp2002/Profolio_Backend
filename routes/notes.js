const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// ROUTES-1 : GET ALL NOTES FROM DB GET: "/api/notes/fetchallnotes". LOGIN REQUIRED
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTES-2 : ADD A NEW NOTE TO DB POST: "/api/notes/addnote". LOGIN REQUIRED
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTES-3 : UPDATE AN EXISTING NOTE TO DB PUT: "/api/notes/updatenote". LOGIN REQUIRED
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
    
        // Create a newNote object
        const newNote = {};
        if (title) {
        newNote.title = title;
        }
        if (description) {
        newNote.description = description;
        }
        if (tag) {
        newNote.tag = tag;
        }
    
        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
        return res.status(404).send("Not Found");
        }
        if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
        );
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTES-4 : DELETE AN EXISTING NOTE TO DB PUT: "/api/notes/deletenote". LOGIN REQUIRED
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
        // const { title, description, tag } = req.body;
    
        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
        return res.status(404).send("Not Found");
        }
        if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(
        req.params.id
        );
        res.json({"Success": "Note Successfully Deleted", note:note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
