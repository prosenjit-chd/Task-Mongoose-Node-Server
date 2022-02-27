const mongoose = require('mongoose');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    }
})
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'author'
})

module.exports = mongoose.model('User', userSchema)

