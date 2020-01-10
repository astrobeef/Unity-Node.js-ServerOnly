const db = require("../models");

module.exports = {
    findOne: function(req, res){
        console.log(req.params.id);
        console.log("^^req.params.id");
        db.User
        .find({username : req.params.id})
        .then(db_user => res.json(db_user))
        .catch(err => res.status(422).json(err));
    },
    createOne: function(req, res){
        db.User.create({
            username: req.body.username,
            connected: true
        }).then((data) => {
            console.log("created reference to the player");
            res.json(data);
        }).catch(err => res.status(422).json(err));
    },
    updateOne: function(req, res){
        
        db.User.update(
            {username : req.body.username},
            {$set: req.body.alterData}
        ).then((data) => {
            console.log(data);
            console.log("Successfully updated player data");
        })
    }
}