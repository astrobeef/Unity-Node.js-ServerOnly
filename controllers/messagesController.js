const db = require("../models");

module.exports = {
    findAll: function (req, res) {
        db.Messages
            .find({})
            .then(db_user => res.json(db_user))
            .catch(err => res.status(422).json(err));
    },
    findOne: function (req, res) {
        db.Messages
            .find({ username: req.params.id })
            .then(db_user => res.json(db_user))
            .catch(err => res.status(422).json(err));
    },
    createOne: function (req, res) {
        db.Messages.create({
            username: req.body.username,
            message: req.body.message
        }).then((data) => {
            console.log("created reference to the player");
            res.json(data);
        }).catch(err => res.status(422).json(err));
    }
}