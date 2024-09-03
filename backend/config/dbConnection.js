const mongoose = require('mongoose')

async function connectDB() {
    try {
        mongoose.connect(process.env.ATLASBD_URL)
        console.log('Connected to DB')
    } catch (err) { console.log(err) }
}
module.exports = connectDB