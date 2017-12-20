var soap = require('soap');

function CorreiosSOAPCliente() {
    this._endpoint = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

CorreiosSOAPCliente.prototype.calculaPrazo = function(dadosEntrega, callback) {

    soap.createClient(this._endpoint, function (err, client) {
        client.CalcPrazo(dadosEntrega, callback);
    });


};

module.exports = function() {
    return CorreiosSOAPCliente;
}


