const express = require('express');
const router = express.Router()

// Here import the Model, this should be change 
const Project = require('../models/project');


//Get all Method
router.get('/getAllProject', async (req, res) => {
    try {
        // const data = await Project.find().populate({ path: "creator", model: "User" });
        const data = await Project.find().populate([{ path: "creator", model: "User" }, { path: "taskinfo", model: "Task" }]);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


//Get Filter Method
router.get('/getProjectByUser/:userid', async (req, res) => {
    const userId = req.params.userid;
    try {
        const data = await Project.find({ author: userId }).populate({ path: "creator", model: "User" });
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Post Method
router.post('/postProject', async (req, res) => {
    const data = new Project(req.body)

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;