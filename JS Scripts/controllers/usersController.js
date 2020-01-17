const db = require("../models");

module.exports = {
    findOne: function(req, res){
        db.User
        .find({username : req.params.id})
        .then(db_user => res.json(db_user))
        .catch(err => res.status(422).json(err));
    },
    createOne: function(req, res){
        db.User.create({
            username: req.body.username,
            connected: true,
            accessToken : "_"
        }).then((data) => {
            console.log("created reference to the player");
            res.json(data);
        }).catch(err => res.status(422).json(err));
    },
    updateOne: function(req, res){

        const payload = req.body;
        
        db.User.update(
            {"username" : payload.username},
            {$set: {"accessToken" : payload.accessToken}
        }).then((data) => {
            console.log(data);
            console.log("Successfully updated player data");
            res.json(data);
        }).catch(err => res.status(422).json(err));
    }
}