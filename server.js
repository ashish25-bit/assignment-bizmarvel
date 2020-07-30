const express = require('express')
const cookieParser = require("cookie-parser")
const cors = require('cors')
const connectDb = require('./core/db')
const fileUpload = require('express-fileupload')

const app = express()
connectDb()

// initialize the body parser
app.use(express.json({extented: false}))
// initialize body parser for normal logging in and signing in 
app.use(express.urlencoded({ extended: false }))

app.use('/api/users', require('./routes/users'))
app.use('/api/blog', require('./routes/blog'))

app.use(cors())
app.use(cookieParser())
app.use(fileUpload())

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))