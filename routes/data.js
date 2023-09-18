const express = require('express');
const router = express.Router();
const Data = require('../models/Data');
const fetchuser = require("../middleware/fetchuser");

// POST route to add data
router.post('/adddata',fetchuser ,async (req, res) => {
    try {
      const newData = new Data(req.body);
      await newData.save();
      res.status(201).json({ message: 'Data added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add data' });
    }
  });

// GET route to get data
router.get('/getdata',fetchuser ,async (req, res) => {
    try {
      const data = await Data.findOne({ user : req.user }); // You may need to modify this to fetch the specific data you want.
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

module.exports = router;
