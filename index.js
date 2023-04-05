const Network = require('./components/services/Network');

const network = new Network('0.0.0.0', 3000);
network.run()