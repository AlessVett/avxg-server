const crypto = require('crypto'),
    entityEvents = require('../config/events/entity.events');

class Entity {
    constructor(entity) {
        this.entity = entity;
        this.isHost = false;
        this.lobby = null;
        this.peerConnections = [];

        const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", {
            namedCurve: 'secp384r1',
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: 'pem'
            }
        });

        this.ecdsa = {
            privateKey: privateKey,
            publicKey: publicKey
        }

        this.loadEvents();
    }

    loadEvents() {
        Object.entries(entityEvents).forEach(([key, callback]) => {
            this.entity.on(key, callback(this));
        });
    }

    getConnData() {
        return this.entity.conn;
    }

    getSocket() {
        return this.entity;
    }

    getLobby() {
        return this.lobby;
    }

    setLobby(lobby) {
        this.lobby = lobby;
    }

    emit(event, data) {
        this.entity.emit(event, data);
    }
}

module.exports = Entity;