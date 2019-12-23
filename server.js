// ws://127.0.0.1:52300/socket.io/?EIO=4&transport=websocket
// ws://unity-node-game-server.herokuapp.com:80/socket.io/?EIO=4&transport=websocket
// https://unity-node-game-server.herokuapp.com/

PORT = process.env.PORT || 52300;
DB_NAME = "unity-node-database";

const express = require("express")
const app = express();
const server = require("http").Server(app);
// const io = require('socket.io')(process.env.PORT || PORT);
const io = require("socket.io")(server);
const path = require("path");

//Mongoose requires
const mongojs = require("mongojs");
const mongoose = require("mongoose");
const logger = require("morgan");

server.listen(PORT);

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));

// Serve up static assets (usually on heroku)
  app.use(express.static("client/build"));

app.get("*", function(req, res){
    console.log("Hello");
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const Server = require("./Classes/Server");

/*------------------------*/
/*---- Custom Classes ----*/
/*------------------------*/

console.log(`Server has started on http://localhost:${PORT}`);

const cServer = new Server();

setInterval(() => {
    cServer.onUpdate();
}, 100, 0);

io.on("connection", function(socket){
    const connection = cServer.onConnected(socket);
    connection.createEvents();
    connection.socket.emit("register", {'id' : connection.player.id});
    socket.emit("news", {hello : "world"});
    socket.on("my other event", function (data){
        console.log(data);
    });
});

function interval(func, pWait, pTimes) {
    const iInterval = function (iWait, iTimes) {
        return function () {
            if (typeof iTimes === "undefined" || iTimes-- > 0) {
                setTimeout(iInterval, iWait);
                try {
                    func.call(null);
                } catch (error) {
                    t = 0;
                    throw error.toString();
                }
            }
        }
    }(pWait, pTimes);

    setTimeout(iInterval, pWait);
}

/* ------------------ */
/* ---- Database ---- */
/* ------------------ */

//Connect to database.
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/${DB_NAME}`, {
    useNewUrlParser : true,
    useFindAndModify: true
});

//Set up Mongo database.
const databaseUrl = process.env.MONGODB_URI || DB_NAME;
const collections = [DB_NAME];

//Set reference to our database.
// const db = mongojs(databaseUrl, collections);
const db = require("./models"); 


db.Test.create({name : "Test name", test : "test test"})
.then(dbTest => {
    console.log(dbTest);
})
.catch(({message}) => {
    console.log(message);
})