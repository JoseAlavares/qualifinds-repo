const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({    
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },    
    email: {
        type: String,
        required: true
    },    
    created_at: Date,
    created_by: String,
    modified_at: Date,
    modified_by: String,
    active: {
        type: Number,
        min: 0,
        max: 1
    }
});

//module.exports = mongoose.model({name: "users", userSchema, collection: "users");
module.exports = mongoose.model("users", userSchema);