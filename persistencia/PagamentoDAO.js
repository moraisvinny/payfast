function PagamentoDAO(connection) {

    this._connection = connection;
}

PagamentoDAO.prototype.atualiza = function (pagamento, callback) {
    this._connection.query(
        'UPDATE pagamentos SET status = ? WHERE id = ?',
        [pagamento.status, pagamento.id],
        callback
    );
}

PagamentoDAO.prototype.salva = function (pagamento, callback) {

    this._connection.query('INSERT INTO pagamentos SET ?', pagamento, callback);
};

PagamentoDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query("select * from pagamentos where id = ?", [id], callback);
}

module.exports = function () {
    return PagamentoDAO;
};