const express = require('express')
const router = express.Router()
const fileUpload = require('express-fileupload')

const auth = require('../middleware/auth')
const Edit = require('../models/Edit')
const Blog = require('../models/Blog')
const User = require('../models/User')

const app = express()
app.use(fileUpload())

// create the blog
router.post('/create', auth, async (req, res) => {
    try {
        const name = req.body.name.trim()
        const newBlog = new Edit({
            name,
            user: req.user.id
        })
        const result = await newBlog.save()
        res.status(200).send(result._id)
    }
    catch (err) {
        res.status(500).send(null)
        console.log(err)
    }
})

// getting the blog details and authenticating the user
router.get('/get/:id', auth, async (req, res) => {
    const { id } = req.params
    try {
        const edit = await Edit.findOne({ _id: id })

        // if no blog is found
        if (!edit)
            return res.status(404).json("No Blog Found")

        // if the blog is found and but the is not authorized
        if (`${edit.user}` != req.user.id)
            return res.status(400).json("Not Authorized.")

        res.status(200).json({ info: edit, error: "" })
    }
    catch (err) {
        console.log(err)
        res.status(500).send("Server Error.")
    }
})

// get all the blogs made by the user
router.get('/saved/all', auth, async (req, res) => {
    try {
        const edits = await Edit.find({ $and: [{ user: req.user.id }, { uploaded: false }] })
        res.status(200).send(edits)
    }
    catch (err) {
        console.log(err)
        res.send('Server Error')
    }
})

// save the doc
router.put('/save/blog', auth, async (req, res) => {
    const { id, content } = req.body
    try {
        const edit = await Edit.findOne({ _id: id })
        edit.context = content
        await edit.save()
        res.send('Changes Saved.')
    }
    catch (err) {
        console.log(err)
        res.send('Error')
    }
})

// post the blog
router.post('/post', auth, async (req, res) => {
    let { id, name, markdownText, read, level, tags } = req.body

    try {
        let tagList = tags.map(tag => tag.title)
        const blog = new Blog({
            user: req.user.id,
            name,
            context: markdownText,
            read,
            level,
            tags: tagList
        })
        await blog.save()
        await Edit.findOneAndDelete({ _id: id })
        res.status(200).send('okay')
    }
    catch (err) {
        console.log(err)
        res.send('Error')
    }
})

// get all blogs the posted by the user 
router.get('/get/all/blogs', auth, async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user.id })
            .populate('user', 'name')
            .sort({ date: -1 })
        if (!blogs || !blogs.length)
            return res.status(404).send('No Blogs Found')
        res.status(200).send(blogs)
    }
    catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

// get one blog
router.get('/get/one/:id', auth, async (req, res) => {
    const { id } = req.params
    try {
        const blog = await Blog.findOne({ _id: id })
            .populate('user', ['name', 'username'])
        if (!blog)
            return res.status(404).send('Not Found')
        res.status(200).send(blog)
    }
    catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

router.post('/image/upload', auth, (req, res) => {
    if (req.files) {
        const { image } = req.files.image
        console.log(image)
        image.mv(`${__dirname}/client/upload/${file.name}`, err => {
            if (err) {
                console.log(err)
                return res.status(500).send('Server Error')
            }
            res.json({ data: file.name, filePath: `/upload/${file.name}` })
        })
    }
    else {
        console.log(null)
    }
})

// get blogs by profile name
router.get('/get/blogs/user/:username', auth, async (req, res) => {
    const { username } = req.params
    try {
        const user = await User.findOne({ username }).select('_id')
        if (!user)
            return res.status(400).send('No User Found')

        const blogs = await Blog.find({ user: user._id }).sort({ date: -1 })
        if (!blogs || !blogs.length)
            return res.status(400).send('No Blogs Found.')
        res.status(200).send(blogs)
    }
    catch (err) {
        console.log(err)
        res.send('Server Error')
    }
})

// display some blogs when the search page is opened.
router.get('/random', auth, async (req, res) => {
    // console.log(new Date(Date.now()))
    const filter = { user: { $not: { $eq: req.user.id } } }
    const options = { limit: 5, populate: 'user' }
    Blog.findRandom(filter, {}, options, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send('Error')
        }
        res.status(200).send(result)
    })
})

// get claps
router.get('/claps/:id', auth, async (req, res) => {
    const { id } = req.params
    try {
        const claps = await Blog.findOne({ _id: id }).select('claps')
        res.status(200).send(claps)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

router.put('/clapped/:id', auth, async (req, res) => {
    const { id } = req.params
    try {
        const blog = await Blog.findOne({ _id: id })
        blog.claps += 1;
        await blog.save()
        res.send(blog)
    } 
    catch (err) {
        res.status(500).send('Server Error')
    }
})

module.exports = router
