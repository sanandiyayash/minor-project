require('dotenv').config();
const express = require('express');
const connectDB = require('./config/dbConnection');
const userRouter = require('./routes/userRoutes')
const invoiceRouter = require('./routes/invoiceRoute')
const itemRouter = require('./routes/itemRoute')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

connectDB();
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());


app.use("/user", userRouter);
app.use('/invoice', invoiceRouter)
app.use('/items', itemRouter)
app.listen(3000, () => { console.log('server is running on http://localhost:3000') });