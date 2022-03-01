const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    designation: {
        required: true,
        type: String
    },
    serial: {
        required: true,
        type: Number
    },
    isCompleted: {
        required: true,
        type: Boolean
    },
    creator: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    taskinfo: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }
},
    {
        timestamps: true
    })

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;