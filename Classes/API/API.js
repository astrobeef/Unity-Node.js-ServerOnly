const db = require("../../models");

module.exports = {
    getPlayer: function (playerID) {

        return new Promise(function (resolve, reject) {

            db.Player.find({ connection_id: playerID }, (err, data) => {

                if (err) {
                    reject(err);
                }

                if (data.length > 0) {
                    resolve(JSON.stringify(data));
                }
                else {
                    resolve(false);
                }
            })
        })
    },
    /**
     * Updates data on the player MongoDB reference, if found.
     * @param {String} playerID - The ID of the player we are trying to get.
     * @param {Object} alterData - The data to be altered on the collection.
     * @returns nothing, unless there's an error.
     */
    updatePlayer: function (playerID, alterData) {

        return new Promise(function (resolve, reject) {

            db.Player.update(
                { connection_id: playerID },
                { $set: alterData }
            ).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });

        })

    },
    getUserByToken: function (accessToken = String) {
        return new Promise(function (resolve, reject) {

            db.User.find(
                { accessToken: trimWeirdChars(accessToken.accessToken) }
            )
                .then((data) => {
                    console.log(data);
                    if (data.length > 0) {
                        resolve(data[0]);
                    }
                    else {
                        resolve(null);
                    }
                })
                .catch((err) => reject(err));
        })
    },
    /**
     * This creates a reference to our Mongo DB for this connection, based on the player's ID
     * @param {String} username - The username of our connected player (connection.player.username)
     * @param {String} playerID - The ID of our connected player (connection.player.id)
     */
    createPlayer: function (username, playerID) {
        return new Promise(function (resolve, reject) {
            db.Player.create({
                connection_id: playerID,
                username: username,
                connected: true
            }).then((creationInfo) => {
                resolve(creationInfo);
            }).catch(err => reject(err));
        })
    },

    /**
     * 
     * @param {String} playerID - The ID of the player, from the connection (connection.player.id)
     */
    deletePlayer: function (playerID){
        return new Promise((resolve, reject) => {
            db.Player.deleteOne({
                connection_id: playerID
            }).then((deletionInfo) => {
                console.log(`"Removed reference to the player, ${playerID}"`);
                resolve(deletionInfo);
            }).catch(err => reject(err));
        })
    }
}

/**
 * 
 * @param {String} string - Takes a string and trims weird characters.
 * @returns a string without weird characters
 */
function trimWeirdChars(string) {
    let returnString = string.split("");

    returnString = returnString.filter((char) => {
        const charCode = char.charCodeAt(0);

        if (charCode >= 32 && charCode <= 126) {
            return true;
        }
        else {
            return false;
        }
    })

    returnString = returnString.join("").trim();

    return returnString;
}