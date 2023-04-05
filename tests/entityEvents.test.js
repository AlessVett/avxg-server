const entityEvents = require('../components/config/events/entity.events');


Object.entries(entityEvents).forEach(([key, callback]) => {
    console.log(key, callback);
});

/**
 *  const test = {
 *      'test': (data) => data
 *  };
 *
 *  Object.entries(test).forEach(([key, callback]) => {
 *      console.log(key, callback('test'))
 *  })
 */