// ws://127.0.0.1:52300/socket.io/?EIO=4&transport=websocket
// ws://unity-node-game-server.herokuapp.com:80/socket.io/?EIO=4&transport=websocket
// https://unity-node-game-server.herokuapp.com/

PORT = process.env.PORT || 80;

const app = require("express")();
const server = require("http").Server(app);
// const io = require('socket.io')(process.env.PORT || PORT);
const io = require("socket.io")(server);

server.listen(PORT);

app.get("*", function(req, res){
    console.log("Hello");
    res.send(200);
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