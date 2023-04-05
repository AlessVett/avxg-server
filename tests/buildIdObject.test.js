const crypto = require('crypto');
require('dotenv').config();

const buildIdObject = () => {
    const difficult = parseInt(`${(Math.random() * 3) + 3}`, 10),
        salt = process.env.BUILD_ID_LOBBY_SALT,
        startWith = [...Array(difficult).keys()].map(() => 0).join("");

    let nonce = 0,
        _id = crypto.createHash('sha256');
    _id.update(salt + difficult + '0.0.0.0' + nonce);

    while (!_id.copy().digest('hex').startsWith(startWith)) {
        nonce++;
        _id.update(salt + difficult + '0.0.0.0' + nonce);
    }

    const _value = _id.digest('hex');

    return {
        value: _value.substring(0,20) + '.' + _value.substring(20, 26) + '.' + _value.substring(26),
        difficult: difficult,
        nonce: nonce
    }
}

console.log(buildIdObject());