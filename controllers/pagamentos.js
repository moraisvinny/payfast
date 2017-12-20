module.exports = function (app) {
    app.get("/pagamentos", function (req, res) {
        res.send("OK");
    });

    app.get("/pagamentos/pagamento/:id", function(req, res){
        
        console.log("Pesquisando pagamento");
        var id = req.params.id;

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.buscaPorId(id, function(err, result) {
            if(err) {
                console.log("ERRO: ", err);
                res.status(500).send(err);
                return;
            }

            console.log("Pagamento encontrado: ", result);
            res.json(result);
        });
    });


    app.delete("/pagamentos/pagamento/:id", function (req, res) {

        var id = req.params.id;
        var pagamento = { id: id, status: "CANCELADO" };

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.atualiza(pagamento, function (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.status(204).send(pagamento);
        });
    });


    app.put("/pagamentos/pagamento/:id", function (req, res) {

        var id = req.params.id;
        var pagamento = { id: id, status: "CONFIRMADO" };

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.atualiza(pagamento, function (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.send(pagamento);
        });
    });

    app.post("/pagamentos/pagamento", function (req, res) {

        var pagamento = req.body.pagamento;


        req.assert("pagamento.forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
        req.assert("pagamento.valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
        req.assert("pagamento.moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3, 3);

        var erros = req.validationErrors();

        if (erros) {

            console.log("Erros de validação encontrados");
            res.status(400).send(erros);
            return;

        }

        console.log("processando pagamento...");
        pagamento.status = "CRIADO";
        pagamento.data = new Date();

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.salva(pagamento, function (err, result) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            pagamento.id = result.insertId;
            console.log("pagamento criado: " + result);

            if (pagamento.forma_de_pagamento === 'cartao') {
                var cartao = req.body.cartao;
                var clienteCartao = new app.servicos.ClienteCartoes();
                clienteCartao.autoriza(cartao, function (excp, request, response, cartaoResult) {
                    if (excp) {
                        console.log("Erro na integração com cartões: ", excp);

                        res.status(500).json(excp);
                        return;

                    }

                    res.location('/pagamentos/pagamento/' + pagamento.id);

                    var responseComCartao = {
                        dados_do_pagamento: pagamento,
                        cartao: cartaoResult,
                        links: [
                            {
                                href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
                                rel: 'confirmar',
                                method: 'PUT'
                            },
                            {
                                href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
                                rel: 'cancelar',
                                method: 'DELETE'
                            }
                        ]
                    };
                    res.status(201).json(responseComCartao);

                });

            } else {

                res.location('/pagamentos/pagamento/' + pagamento.id);

                var response = {
                    dados_do_pagamento: pagamento,
                    links: [
                        {
                            href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
                            rel: 'confirmar',
                            method: 'PUT'
                        },
                        {
                            href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
                            rel: 'cancelar',
                            method: 'DELETE'
                        }
                    ]
                };


                res.status(201).json(response);
            }



        });
    });
};