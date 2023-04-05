const socketIndex = (() => {
    let vars = {
        socket: null
    };

    const getSocket = () => {
        return vars.socket;
    }

    const setSocket = (socket) => {
        vars.socket = socket;
    }

    return {
        getSocket: getSocket,
        setSocket: setSocket
    }
})();

module.exports = socketIndex;