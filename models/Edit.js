const mongoose = require('mongoose')

const EditSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        default: Date.now()
    },
    context: {
        type: String,
        default: ""
    },
    uploaded: {
        type: Boolean,
        default: false
    },
    attachments: []
})

module.exports = Edit = mongoose.model('edit', EditSchema)