// ws://127.0.0.1:52300/socket.io/?EIO=4&transport=websocket
// ws://unity-node-game-server.herokuapp.com:80/socket.io/?EIO=4&transport=websocket
// https://unity-node-game-server.herokuapp.com/

/*----------------*/
/*Static Variables*/
/*----------------*/

PORT = process.env.PORT || 52300;       //If we are provided a port by a third party, then use that.  If not, use port 52300.
DB_NAME = "unity-node-database";        //Specify the name of our mongoose database

//File imports
const Server = require("./Classes/Server");

/*---------------*/
/*--NPM Imports--*/
/*---------------*/

const express = require("express")                              //Import the 'express' npm package.  Used to establish server connections for web client.
const app = express();                                          //Establish express server.

const path = require("path");                                   //Import for file paths.

//Mongoose requires
const mongojs = require("mongojs");
const mongoose = require("mongoose");
const logger = require("morgan");

//---Connecting web server and game server to one port
const server = require("http").Server(app);                     //Wrap our express server in an http server.  This will allow us to connect our game server and web server with sockets.
const io = require("socket.io")(server);                        //Wrap our server in a socket element so we may use sockets to connect our servers.

/*--------------------*/
/*Middleware functions*/
/*--------------------*/

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));

// Serve up static assets (usually on heroku)
app.use(express.static("web-client/build"));


/*---------------------------*/
/*Establish server connection*/
/*---------------------------*/

server.listen(PORT);        //Sets up our server to listen for events.

/*------------------------*/
/*--------Routing---------*/
/*------------------------*/

const routes = require("./routes");

app.use(routes);        //Use our routes established in our 'routes' directory.

// '*' catches all paths which are not caught previously.
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./web-client/build/index.html"));        //Respond to the route 'get' request with our React index.html file.  This can be accessed by specifiying our current directory, "__dirname"
});

/*------------------------*/
/*---- Custom Classes ----*/
/*------------------------*/

console.log(`Server has started on http://localhost:${PORT}`);

const cServer = new Server();       //Create an instance of our 'Server' class

/*------------------------*/
/*-------- Update --------*/
/*------------------------*/

setInterval(() => {         //Each 100ms, repeated infintely, do the following
    cServer.onUpdate();         //Run the update method on our instanced 'Server' class
}, 100, 0);

/*------------------------*/
/*-------- Socket --------*/
/*------------------------*/

//Upon a socket.io connection, do the following, passing in the 'socket' connection
io.on("connection", function (socket/* The socket we've connected to */) {

    const connection = cServer.onConnected(socket);             //Run the "onConnected" method on our server, passing in our 'socket' connection.  Establish a reference to the connection made with the socket.

    connection.db = require("./models");                                    //Set a reference, for our connection, to our database.
    connection.createEvents();                                              //Create the events for our connection.
    connection.socket.emit("register", { 'id': connection.player.id });         //Register our connection with the ID of our player, found from our connection.
    socket.emit("news", { hello: "world" });
    socket.on("my other event", function (data) {
        console.log(data);
    });
});

/*-------------------------*/
/*-------- Methods --------*/
/*-------------------------*/


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
    useNewUrlParser: true,
    useFindAndModify: true
});

//Set up Mongo database.
const databaseUrl = process.env.MONGODB_URI || DB_NAME;
const collections = [DB_NAME];

//Set reference to our database.
// const db = mongojs(databaseUrl, collections);
const db = require("./models");

DB_WipeOnStart();

function DB_WipeOnStart() {
    console.warn(`!!! Wiping our MongoDB !!!`);

    db.Player.remove({}, function (err, data) {
        if (err) throw err;
        console.log(`Removed Player collection from DB ...`);
        console.log(data);
    })
}