const Lobby = require('../models/Lobby');

class Lobbies {
    constructor() {
        this.lobbies = [];
    }

    newLobby(entity) {
        const lobby = new Lobby(entity);
        this.lobbies.push(lobby);
        entity.setLobby(lobby);
    }

    getFirstLobby() {
        return this.lobbies[0];
    }

    lobbyExist() {
        return this.lobbies.length > 0;
    }
}

module.exports = Lobbies;