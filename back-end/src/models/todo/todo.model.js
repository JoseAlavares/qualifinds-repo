const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({    
    name: {
        type: String,
        required: true,
        min:10
    },    
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },    
});

module.exports = mongoose.model("todo", todoSchema);