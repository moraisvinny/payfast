var fs = require('fs');

fs.readFile("imagem.png", function(err, data){
    if(err) {
        console.log("Deu ruim pra carregar o arquivo");
    }

    console.log("arquivo lido");
    console.log(data);

    fs.writeFile('imagem2.png', data, function(err){
        console.log('arquivo escrito');
    });
    
});
