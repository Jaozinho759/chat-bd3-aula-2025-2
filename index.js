const express = require('express')
const http = require('http');
const socket = require('socket.io')
const ejs = require('ejs')
const path = require('path')

const app = express();
const server = http.createServer(app);
const io = socket(server);


app.use(express.static(path.join(__dirname, 'public')));

app.set('view', path.join(__dirname, 'public'))

app.engine('html', ejs.renderFile);

app.use('/', (req, res) => {
    res.render('index.html');
})

/* LOGICA DE SOCKE.IO EMVIO E PROPAGAÇÃO DE MENSAGENS*/

/* ESTRUTURA DE CONEXÃO DO SOCKET.IO*/

let menssagens = []

io.on('connection', socket => {
    console.log("NOVO USUÁRIO CONECTADO: " + socket.id);

    socket.emit('previousMessage', menssagens);

    socket.on('sendMessage', data => {
        menssagens.push(data)

        socket.broadcast.emit('reciveMessage', data);
    })


});

server.listen(3000, () => {
    console.log('CHAT RODANDO EM - http://localhost:3000')
});