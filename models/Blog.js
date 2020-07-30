const mongoose = require('mongoose')
const random = require('mongoose-simple-random')

const BlogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    context: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    read: {
        type: Number,
        required: true,
        trim: true
    },
    level: {
        type: String,
        trim: true
    },
    tags: [],
    claps: {
        type: Number, 
        default: 0
    }
})

BlogSchema.plugin(random)

module.exports = Blog = mongoose.model('blog', BlogSchema)