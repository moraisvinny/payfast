var app = require('./config/custom-express')();

app.listen(3000, function(){
    console.log("Server Online");
})