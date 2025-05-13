const express = require('express');
const http = require('http');
const socket = require('socket.io')
const ejs = require('ejs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socket(server);


app.use(express.static(path.join(__dirname, 'public')));

app.set('view', path.join(__dirname, 'public'));

app.engine('html', ejs.renderFile);

app.use('/', (req, res) => {

    res.render('index.html')

})

// logica do Socket.IO - envio e propagação de mensagens

//Array que simula o banco de dados:

let messages = []

// Estrutura de Conexão do Socket.IO

io.on('connection', socketResp =>{
    
    console.log('Novo Usúario Conectado: ' + socketResp.id)

    //Recupera e mantém (exibe) as mensagens entre o front e o back

    socketResp.emit('previousMessage', messages);

    //Lógica de chat quando uma mensagem é enviada

    socketResp.on('sendMessage', data =>{

        //Adiciona a mensagem no final do array de messagens

        messages.push(data);

        socketResp.broadcast.emit('receivedMessage', data);

        console.log('Qtd. Mesagens: ' + messages.length );
    });

    console.log('Qtd. Mesagens: ' + messages.length);

});

server.listen(3000, ()=>{console.log('Está tudo online em - http://localhost:3000')});