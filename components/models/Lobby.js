const crypto = require('crypto'),
    SimplePeer = require('simple-peer');
require('dotenv').config();

class Lobby {
    constructor(entity) {
        this.config = {
            hostAddress: entity.getConnData().remoteAddress,
            publicKey: null,
            _id: null
        }

        this.config._id = this.buildIdObject();

        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048
        });

        this.privateKey = privateKey;
        this.config.publicKey = publicKey;

        this.entities = [entity];
    }

    emitToLobby(event, data) {
        this.entities.forEach((entity) => {
            entity.emit(event, data);
        });
    }

    emitToLobbyForPeerConnection(event, data, _data) {
        this.entities.forEach((entity) => {
            entity.emit(event, data, _data);
        });
    }

    addEntity(entity) {
        this.entities.push(entity);
        entity.setLobby(this);
        entity.emit('connToLobby', this.config);
        this.createRTCConnection();
    }

    createRTCConnection() {
        const lastEntity = this.entities[this.entities.length - 1];

        this.entities.slice(0, -1).forEach((entity) => {
            const peerConnection = new SimplePeer({
                initiator: true
            });

            peerConnection.on('signal', (data) => {
                lastEntity.emit('rtc_offer', {
                    offer: data,
                    peerId: entity.getSocket().peerId
                });
            });

            peerConnection.on('connect', () => {});

            peerConnection.on('data', (data) => {});

            peerConnection.on('close', () => {});

            peerConnection.on('error', (error) => { console.log(error) });

            peerConnection.peerId = entity.getSocket().peerId;
            peerConnection.signal(entity.getSocket().signal);
            lastEntity.peerConnections.push(peerConnection);
        });
    }

    handleRTCOffer(data, receiver) {
        const {offer, peerId} = data;

        const entity = this.entities.find((entity) => entity.getSocket().peerId === peerId);
        const receiverConnection = new SimplePeer({
            initiator: false
        });

        receiverConnection.on('signal', (data) => {
            receiver.emit('rtc_answer', {
                answer: data,
                peerId: peerId
            });
        });

        receiverConnection.on('connect', () => {});

        receiverConnection.on('data', (data) => {});

        receiverConnection.on('close', () => {});

        receiverConnection.on('error', (error) => { console.log(error) });

        receiverConnection.peerId = peerId;
        receiverConnection.signal(offer);
        entity.peerConnections.push(receiverConnection);
    }

    handleRTCAnswer(data, sender) {
        const { answer, peerId} = data;
        const connection = sender.peerConnections.find((peerConnection) => peerConnection.peerId === peerId);
        connection.signal(answer);
    }

    buildIdObject() {
        const difficult = parseInt(`${(Math.random() * 3) + 3}`, 10),
        salt = process.env.BUILD_ID_LOBBY_SALT,
        startWith = [...Array(difficult).keys()].map(() => 0).join("");

        let nonce = 0,
            _id = crypto.createHash('sha256');
        _id.update(salt + difficult + this.config.hostAddress + nonce);

        while (!_id.copy().digest('hex').startsWith(startWith)) {
            nonce++;
            _id.update(salt + difficult + this.config.hostAddress + nonce);
        }

        const _value = _id.digest('hex');

        return {
            value: _value.substring(0,20) + '.' + _value.substring(20, 26) + '.' + _value.substring(26),
            difficult: difficult,
            nonce: nonce
        }
    }
}

module.exports = Lobby;