const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    username: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    }
});

const User = mongoose.model("Messages", MessagesSchema);

module.exports = User;