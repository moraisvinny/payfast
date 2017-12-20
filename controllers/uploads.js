var fs = require('fs');

module.exports = function(app) {


    app.post('/upload/imagem', function(req, res){
        
        console.log("Recebendo imagem");
        var filename = req.headers.filename;
        req.pipe(fs.createWriteStream('util/' + filename))
            .on('finish', function(){
                res.send("Envio de imagem concluído");
            });


    });
}