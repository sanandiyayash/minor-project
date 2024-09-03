const mongoose = require('mongoose');
const User = require('./models/user')
const connectDB = require('./config/dbConnection')

connectDB()

async function initDb() {
    await User.deleteMany({});
    // initData.data = initData.data.map((obj) => ({
    //     ...obj, owner: "6628f7b5237ee2ece1739573",
    // }));
    // await Listing.insertMany(initData.data)
}
initDb().then(() => {
    console.log("Data initialized");

});