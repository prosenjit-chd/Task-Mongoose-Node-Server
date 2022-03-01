const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    isCompleted: {
        required: true,
        type: Boolean
    },
    author: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
    {
        timestamps: true
    })

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;

