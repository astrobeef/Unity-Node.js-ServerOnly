const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    connection_id:{
        type: String,
        required: true
    },
    username: {
        type: String,
        trim: true
    },
    connected: {
        type: Boolean,
        required: true
    }
});

const Player = mongoose.model("Player", PlayerSchema);

module.exports = Player;