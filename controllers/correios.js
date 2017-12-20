module.exports = function (app) {


    app.post('/correios/calculo-prazo', function(req, res){
        

        req.assert("nCdServico", "código do serviço é obrigatório").notEmpty();
        req.assert("sCepOrigem", "cep de origem é obrigatório").notEmpty();
        req.assert("sCepDestino", "cep de destino é obrigatório").notEmpty();


        var erros = req.validationErrors();
        if(erros) {
            res.status(400).send(erros);
        }
        var dadosEntrega = req.body;
        var correioClient = new app.servicos.CorreiosSOAPCliente();
        correioClient.calculaPrazo(dadosEntrega, function(err, result){
            
            if(err) {
                res.status(500).json(err);
                return;
            }

            res.status(200).json(result);

        });

    });
}