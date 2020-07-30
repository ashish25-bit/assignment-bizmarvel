const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('../models/User')
const auth = require('../middleware/auth')
const { restart } = require('nodemon')

// register the user
router.post('/register', async (req, res) => {
    let { username, email, password, name } = req.body
    username = username.toLowerCase()
    email = email.toLowerCase()
    try {
        let user = await User.findOne({ $or: [{ username }, { email }] })
        // if user exists terminate register
        if (user)
            return res.status(400).send(user.username == username ? 'Username taken' : 'Email Already Exists')

        user = new User({
            username,
            email,
            password,
            name
        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('SESSION_SECRET'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err
                res.json({ token })
            })
    }
    catch (err) {
        console.log(err)
        res.status(500).send('Server error')
    }
})

// user login
router.post('/login', async (req, res) => {
    let { username, password } = req.body
    username = username.toLowerCase()
    try {
        let user = await User.findOne({ $or: [{ username }, { email: username }] })

        // if the email or username is not found.
        if (!user)
            return res.status(400).send('No Account found. Try Signing Up?.')

        const isMatch = await bcrypt.compare(password, user.password)
        // if the password is worng
        if (!isMatch)
            return res.status(400).send('Invalid Credentials')

        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get('SESSION_SECRET'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err
                res.json({ token })
            })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }
})

// authenticate the user and send details
router.get('/auth', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

// check whether the username is taken or not
router.get('/check/username', async (req, res) => {
    try {
        const { username } = req.query
        const user = await User.findOne({ username })
        if (!user)
            return res.send(false)
        res.send(true)
    }
    catch (err) {
        console.log(err)
        res.send('Server Error')
    }
})

// get user by username
router.get('/get/user/:username', auth, async (req, res) => {
    const { username } = req.params
    try {
        const user = await User.findOne({ username }).select('-password')
        if (!user) 
            return res.status(404).send('No User Found') 
        res.status(200).send(user)  
    } 
    catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

router.get('/search/user', auth, async (req, res) => {
    const { key } = req.query
    try {
        const regex = new RegExp(escapeRegex(key), 'i')
        const users = await User.find({
            $and: [
                {
                    $or: [
                        { username: { $regex: regex } },
                        { name: { $regex: regex } }
                    ]
                },
                {
                    _id: { $not: { $eq: req.user.id } }
                }
            ]
        })
        .select('-password')
        res.status(200).send(users)
    } 
    catch (err) {
        console.log(err)
        res.send('Error')
    }
})

// returns the regex expression
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

module.exports = router
