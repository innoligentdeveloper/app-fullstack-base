//=======[ Settings, Imports & Data ]==========================================

var PORT = 3000;

var express = require('express');
var app = express();
var mysqlConn = require('./mysql-connector');

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));

// const filename= './datos.json';
// var datos = require(filename);

//ESTE PROCESO EJECUTA AL REALIZARSE EL INSERT O EL UPDATE DEL FORMULARIO MODAL
app.post('/insertupdate/', function(req, res) {
    // LEVANTO PARAMETROS ENVIADOS EN EL POST POR ESO USO BODY
    let elId= req.body.id;
    let name =req.body.name;
    let description =req.body.description;
    let state =req.body.state;
    let type =req.body.type;
    //SI EL ID ES "" ES INSERT SINO ES UPDATE
    if (elId==""){
        //EJECUTO EL INSERT
        console.log("INSERTAR");
        mysqlConn.query('insert into Devices (name,description,state,type) values(?,?,?,?)',[name, description,state, type],function(err,respuesta){
            if(err){
                console.log("ERROR AL INSERTAR");
                res.send(err).status(400);
            }
            res.send("Se insertó el registro correctamente.");
        });
    }else{
        //EJECUTO EL UPDATE
        mysqlConn.query('update Devices set name=?, description=?, type=? where id=?',[name, description, type, elId],function(err,respuesta){
            if(err){
                res.send(err).status(400);
            }
            res.send("Se actualizó el registro correctamente.");
        });
    }
});

//ESTE PROCESO SE EJECUTA AL TOCAR SOBRE EL INTERRUPTOR O EL DIMMER DEL DISPOSITIVO PARA GUARDAR SU ESTADO
app.post('/devices_update/', function(req, res) {
    let elId= req.body.id;
    let valor =req.body.status; // aqui puedo recibir un true/false o bien un nro entre 0 y 100
    let spliting= elId.split("_");
    let id = spliting[1];
    mysqlConn.query('update Devices set state=? where id=?',[valor,id],function(err,respuesta){
        if(err){
            res.send(err).status(400);
        }
        res.send("Se actualizó el registro correctamente.");
    });
});
//ESTE PROCESO CONSULTA TODOS LOS DISPOSITIVOS DE LA BASE DE DATOS PARA QUE SEAN MOSTRADOS EN EL DASHBOARD
app.post('/show_devices/', function(req, res) {
    mysqlConn.query('Select * from Devices',function(err,respuesta){
        if(err){
            res.send(err).status(400);
        }
        res.send(respuesta);
     });
});
//ESTE PROCESO EJECUTA EL BORRADO DE UN REGISTRO DE LA BASE DE DATOS
app.post('/eliminar/', function(req, res) {
    let elId= req.body.id;
    mysqlConn.query('delete from Devices where id=?',[elId],function(err,respuesta){
        if(err){
            res.send(err).status(400);
        }
        res.send(respuesta);
     });
});
//=======[ Main module code ]==================================================
app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================