var fs = require('fs');

fs.createReadStream('imagem.png')
    .pipe(fs.createWriteStream('imagem3.png'))
    .on('finish', function(){
        console.log("arquivo escrito com stream");
    });