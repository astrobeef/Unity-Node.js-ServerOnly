PORT = 52300;
const io = require('socket.io')(process.env.PORT || PORT);
const Server = require("./Classes/Server");

/*------------------------*/
/*---- Custom Classes ----*/
/*------------------------*/

console.log(`Server has started on http://localhost:${PORT}`);

const server = new Server();

setInterval(() => {
    server.onUpdate();
}, 100, 0);

io.on("connection", function(socket){
    const connection = server.onConnected(socket);
    connection.createEvents();
    connection.socket.emit("register", {'id' : connection.player.id});
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