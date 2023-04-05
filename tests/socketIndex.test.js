const socketIndex = require('../socket.index');

socketIndex.setSocket('test');

console.log(socketIndex.getSocket());