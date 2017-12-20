var restify = require('restify-clients');

function ClienteCartoes() {
    this._client = restify.createJsonClient('http://localhost:3001');
}

ClienteCartoes.prototype.autoriza = function (cartao, callback) {
    this._client.post('/cartoes/autoriza', cartao, callback);

};

module.exports = function () {
    return ClienteCartoes;
}


