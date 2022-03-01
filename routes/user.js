const express = require('express');
const router = express.Router()

// Here import the Model, this should be change 
const User = require('../models/user');
const Test = require('../middleware/test');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');


//Get all Method
router.get('/getAll', auth, async (req, res) => {
    try {
        const data = await User.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get all with Task
router.get('/getAllwithTask', async (req, res) => {
    try {
        const data = await User.find().populate("tasks").exec();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Post Method
router.post('/post', async (req, res) => {
    const user = new User(req.body)

    // console.log(user);
    try {
        await user.save();
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    }
    catch (error) {
        res.status(400).send({ message: error.message })
    }
})

//Get by ID Method
router.get('/get/:id', async (req, res) => {
    try {
        const data = await User.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await User.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await User.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Log In Method 
router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentails(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        console.log("Hit hit222")
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// Log out method 
router.post('/users/logout/', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send("Log out successfully")
    } catch (e) {
        res.status(500).send()
    }
})
// Log Out All 
router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// View self profile 
router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)
})

//  Update user profile 
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalide update!' })
    }
    try {

        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete Single User Account 
router.delete('/users/me', auth, async (req, res) => {
    try {

        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// Image Avatar Start 
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload jpg, jpeg, png'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

// Image Avatar End 

module.exports = router;