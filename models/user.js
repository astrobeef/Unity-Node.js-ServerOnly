const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true
    },
    connected: {
        type: Boolean,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;