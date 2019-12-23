const LobbyBase = require("./LobbyBase");
const GameLobbySettings = require("./GameLobbySettings");
const Connection = require("../Connection");
const Bullet = require("../Bullet");

module.exports = class GameLobby extends LobbyBase {
    constructor(id, settings = GameLobbySettings) {
        super(id);
        this.settings = settings;
        this.bullets = [];
    }

    onUpdate() {
        const lobby = this;

        lobby.updateBullets();
        lobby.updateDeadPlayers();
    }

    canEnterLobby(connection = Connection) {
        const lobby = this;
        const maxPlayerCount = lobby.settings.maxPlayers;
        const currentPlayerCount = lobby.connections.length;

        if (currentPlayerCount + 1 > maxPlayerCount) {
            return false;
        }

        return true;
    }

    onEnterLobby(connection = Connection) {
        const lobby = this;

        super.onEnterLobby(connection);

        lobby.addPlayer(connection);

        //Handle spawning any server spawned objects here
        //Example : Loot, bullets, etc.
    }

    onLeaveLobby(connection = Connection) {
        const lobby = this;

        super.onLeaveLobby(connection);

        lobby.removePlayer(connection);

        //Handle unspawning any server spawned objects here
        //Example : Loot, bullets, etc.
    }

    updateBullets() {
        const lobby = this;
        const bullets = lobby.bullets;
        const connections = lobby.connections;

        bullets.forEach(bullet => {
            const isDestroyed = bullet.onUpdate();

            if (isDestroyed) {
                lobby.despawnBullet(bullet);
            } else {
                // const returnData = {
                //     id: bullet.id,
                //     position: {
                //         x: bullet.position.x,
                //         y: bullet.position.y,
                //         z: bullet.position.z
                //     }
                // }

                // connections.forEach(connection => {
                //     connection.socket.emit("updatePosition", returnData);
                // });
            }
        })
    }

    updateDeadPlayers() {
        const lobby = this;
        const connections = lobby.connections;

        connections.forEach(connection => {
            const player = connection.player;

            if (player.isDead) {
                const isRespawn = player.respawnCounter();
                if (isRespawn) {
                    const socket = connection.socket;
                    const returnData = {
                        id: player.id,
                        position: {
                            x: player.position.x,
                            y: player.position.y,
                            z: player.position.z
                        }
                    }

                    socket.emit("playerRespawn", returnData);
                    socket.broadcast.to(lobby.id).emit("playerRespawn", returnData);       //Only broadcast to those in the same lobby.
                }
            }
        });
    }

    onFireBullet(connection = Connection, data) {
        const lobby = this;

        const bullet = new Bullet();
        bullet.name = "Bullet";
        bullet.activator = data.activator;
        bullet.position.x = data.position.x;
        bullet.position.y = data.position.y;
        bullet.position.z = data.position.z;
        bullet.direction.x = data.direction.x;
        bullet.direction.y = data.direction.y;
        bullet.direction.z = data.direction.z;

        lobby.bullets.push(bullet);

        const returnData = {
            name: bullet.name,
            id: bullet.id,
            activator: bullet.activator,
            position: {
                x: bullet.position.x,
                y: bullet.position.y,
                z: bullet.position.z
            },
            direction: {
                x: bullet.direction.x,
                y: bullet.direction.y,
                z: bullet.direction.z
            },
            speed: bullet.speed
        }

        connection.socket.emit("serverSpawn", returnData);
        connection.socket.broadcast.to(lobby.id).emit("serverSpawn", returnData);       //Only broadcast to those in the same lobby.
    }

    onCollisionDestroy(connection = Connection, data) {
        const lobby = this;

        const returnBullets = lobby.bullets.filter(bullet => {
            return bullet.id = data.id
        });

        returnBullets.forEach(bullet => {
            const playerHit = false;

            lobby.connections.forEach(iConnection => {
                const player = iConnection.player;

                if (bullet.activator != player.id) {
                    const distance = bullet.position.Distance(player.position);

                    if (distance < 3) {
                        const isDead = player.dealDamage(50);
                        if (isDead) {
                            console.log(`Player with id ${player.id} has died`);
                            const returnData = {
                                id: player.id
                            }
                            iConnection.socket.emit("playerDied", returnData);
                            iConnection.socket.broadcast.to(lobby.id).emit("playerDied", returnData);
                        } else {
                            console.log(`Player with id ${player.id} has ${player.health} health left`);
                        }
                        lobby.despawnBullet(bullet);
                    }
                }
            });

            if (!playerHit) {
                bullet.isDestroyed = true;
            }
        })
    }

    despawnBullet(bullet = Bullet) {
        const lobby = this;
        const bullets = lobby.bullets;
        const connections = lobby.connections;

        console.log(`Destroying bullet (${bullet.id})`);
        const index = bullets.indexOf(bullet);
        if (index > -1) {
            bullets.splice(index, 1);

            const returnData = {
                id: bullet.id
            }

            //Send remove bullet command to players
            connections.forEach(connection => {
                connection.socket.emit("serverUnspawn", returnData);
            })
        }
    }

    addPlayer(connection = Connection) {
        const lobby = this;
        const connections = lobby.connections;
        const socket = connection.socket;

        const returnData = {
            id: connection.player.id
        }

        socket.emit("spawn", returnData);   //Tell myself that I have spawned
        socket.broadcast.to(lobby.id).emit("spawn", returnData);    //Tell others that I have spawned

        //Tell myself about everyone else already in the lobby
        connections.forEach(iConnection => {
            if (iConnection.player.id != connection.player.id) {
                socket.emit("spawn", {
                    id: iConnection.player.id
                })
            }
        });
    }

    removePlayer(connection = Connection) {
        const lobby = this;

        connection.socket.broadcast.to(lobby.id).emit("disconnected", {
            id: connection.player.id
        });
    }
}