const socketIndex = require('../../../socket.index');

const entityEvents = {
    'rtc_offer': (entity) => {
        return (data) => {
            entity.getLobby().handleRTCOffer(data, entity);
        }
    },
    'rtc_answer': (entity) => {
        return (data) => {
            entity.getLobby().handleRTCAnswer(data, entity);
        }
    }
};

module.exports = entityEvents;