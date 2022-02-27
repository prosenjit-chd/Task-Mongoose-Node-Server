const express = require('express');
const router = express.Router()

// Here import the Model, this should be change 
const Task = require('../models/task');


//Get all Method
router.get('/getAllTask', async (req, res) => {
    try {
        const data = await Task.find().populate({ path: "author", model: "User" });
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


//Get Filter Method
router.get('/getTaskByUser/:userid', async (req, res) => {
    const userId = req.params.userid;
    try {
        const data = await Task.find({ author: userId }).populate({ path: "author", model: "User" });
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Post Method
router.post('/postTask', async (req, res) => {
    const data = new Task({
        title: req.body.title,
        isCompleted: req.body.isCompleted,
        author: req.body.author

    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;