const express = require('express');
const http = require('http');
const socket = require('socket.io')
const ejs = require('ejs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const mongoose = require('mongoose');
const { error } = require('console');


app.use(express.static(path.join(__dirname, 'public')));

app.set('view', path.join(__dirname, 'public'));

app.engine('html', ejs.renderFile);

app.use('/', (req, res) => {

    res.render('index.html')

})

function connectDB() {

    let dbURL = 'mongodb+srv://joaovitorsena116:ucR6EEXNZGp7pGeM@cluster0.fdssv.mongodb.net/'

    mongoose.connect(dbURL)

    mongoose.connection.on('error', console.error.bind(console, 'connection error'))

    mongoose.connection.once('open', function() {
        console.log('ATLAS MONGO DB CONECTADO COM SUCESSO!')
    });

}


connectDB();

let Message = mongoose.model('Message', {usuario:String, data_hora:String, message:String});



// logica do Socket.IO - envio e propagação de mensagens

//Array que simula o banco de dados:

let messages = [];

Message.find({})
    .then(docs=>{
        messages = docs
    }).catch(error=>{
        console.log(error);
    });

// Estrutura de Conexão do Socket.IO

io.on('connection', socketResp =>{
    
    console.log('Novo Usúario Conectado: ' + socketResp.id)

    //Recupera e mantém (exibe) as mensagens entre o front e o back

    socketResp.emit('previousMessage', messages);

    //Lógica de chat quando uma mensagem é enviada

    socketResp.on('sendMessage', data =>{

        //Adiciona a mensagem no final do array de messagens

        //messages.push(data);
        let message = new Message(data);

        message.save()
        .then(socket.broadcast.emit('receivedMessage', data))
        .catch(error=>{
            console.log(error);
        });


        console.log('Qtd. Mesagens: ' + messages.length );

    });

    console.log('Qtd. Mesagens: ' + messages.length);

});

server.listen(3000, ()=>{console.log('Está tudo online em - http://localhost:3000')});