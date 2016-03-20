var express = require('express');
var index = require('./routes/index.js');
var app = express();
var bodyparser = require('body-parser');
var port = process.env.PORT || 3000;
var pg = require('pg');
var connectionString;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

if (process.env.DATABASE_URL){
    pg.defaults.ssl=true;
    connectionString = process.env.DATABASE_URL;
} else {
    connectionString = 'postgress://localhost:5432/db_tasks';
}

console.log("connection string =", connectionString);

pg.connect(connectionString, function(err, client, done){
    if(err){
        console.log("error connecting to database", err);
    }
});

app.use('/',index);

var server= app.listen(port,function(){
    var port = server.address().port;
    console.log("Something is alive on port:", port);
})
