const http = require('http'),
    io = require('socket.io'),
    cors = require('cors'),
    Entity = require('../models/Entity'),
    Lobbies = require('./Lobbies'),
    socketIndex = require('../../socket.index');

class Network {
    constructor(hostAddress, port) {
        this.config = {
            hostAddress: hostAddress,
            port: port
        };

        this.lobbies = new Lobbies();

        this.httpServer = http.createServer((req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
            res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
            res.setHeader('Access-Control-Max-Age', 2592000);

            if (req.method === 'OPTIONS') {
                res.setHeader(204);
                res.end();
                return;
            }

            if (['GET', 'POST'].indexOf(req.method) > -1) {
                res.setHeader(200);
                res.end(JSON.stringify({
                    status: true
                }));
                return;
            }

            res.writeHead(405, headers);
            res.end(`${req.method} is not allowed for the request.`);
        });

        this.io = new io.Server(this.httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        this.io
            .on('connection', (socket) => {
                const entity = new Entity(socket);
                if (this.lobbies.lobbyExist()) {
                    const lobby = this.lobbies.getFirstLobby();
                    lobby.addEntity(entity);
                } else {
                    this.lobbies.newLobby(entity);
                }
            });
    }

    run() {
        socketIndex.setSocket(this.io);
        this.httpServer.listen(this.config.port, this.config.hostAddress, () => {
            console.log(`Network on ${this.config.hostAddress}:${this.config.port}`);
        });
    }
}

module.exports = Network;