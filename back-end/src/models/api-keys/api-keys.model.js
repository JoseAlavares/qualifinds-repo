const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const apiKeysSchema = new Schema({    
    api_key: {
        type: String,
        required: true,
        min:10
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

//module.exports = mongoose.model({name: "api_keys", apiKeysSchema, collection: 'api_keys'});
module.exports = mongoose.model("api_keys", apiKeysSchema);