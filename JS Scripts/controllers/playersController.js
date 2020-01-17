const db = require("../models");

module.exports = {
    findAll: function(req, res){
        db.Player
        .find(req.query)
        .then(db_player => res.json(db_player))
        .catch(err => res.status(422).json(err));
    }
}