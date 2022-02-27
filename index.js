const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// This import file should be change 
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');
const projectRouter = require('./routes/project');

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use('/api', userRouter);
app.use('/api', taskRouter);
app.use('/api', projectRouter);

const DatabaseName = "TestingDatabase";
const mongoString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ocrjv.mongodb.net/${DatabaseName}?retryWrites=true&w=majority`;
mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})

