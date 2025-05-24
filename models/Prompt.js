const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
    userPrompt: {
        type: String,

    },
    aiPrompt: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires:'1d'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }


});

const Prompt = mongoose.model('Prompt', promptSchema);

module.exports = Prompt;
