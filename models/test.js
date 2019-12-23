const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TestSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    test: {
        type: String,
        trim: true
    }
})

const Test = mongoose.model("Test", TestSchema);

module.exports = Test;