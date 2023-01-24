const path = require('path');
const https = require('https');
const express = require('express');
const socketio = require('socket.io');
const {formatMessage,Oldmessages, formatMessageBack} = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers 
} = require('./utils/users');
const {pool} = require ('./pool')
const app = express();
const fs = require('fs')

const server = https.createServer({
      key: fs.readFileSync('./certificado/privkey.pem'),
      cert: fs.readFileSync('./certificado/cert.pem')
},app);
const io = socketio(server);
const mysql = require('mysql2');
const d_data = new Date();


function  incluirLinhaChat(d_msg, d_idsac, d_user) {

  const sql =  "INSERT INTO Chat ( mensagem, id_Sac, user) values(?, ?, ?)";

  pool.query(sql,[d_msg, d_idsac, d_user] ,(err, results, fields) => {
    if (err) {
      const errorMessage =
        err.code === "ER_DUP_ENTRY"
          ? "Linha Existente !!!!"
          : "erro interno entre em contato com o fornecedor codigo " + err.code;
    } else {
    }
  })
};

function  incluirLinhaAudioChat(d_msg, d_idsac, d_user) {

  const sql =  "INSERT INTO Chat ( audio, id_Sac, user) values(?, ?, ?)";

  pool.query(sql,[d_msg, d_idsac, d_user] ,(err, results, fields) => {
    if (err) {
      const errorMessage =
        err.code === "ER_DUP_ENTRY"
          ? "Linha Existente !!!!"
          : "erro interno entre em contato com o fornecedor codigo " + err.code;
    } else {
    }
  })
};



// Definindo pasta estática 
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'I.A Atendimento';

// Executar quando o usuário se conectar
io.on('connection', socket => { 
    socket.on('joinRoom', ({ username, room}) => {
      const user = userJoin(socket.id, username, room );
    socket.join(user.room);  
    // Dar bem vindo ao último usuário que entrou
    const sql =  "SELECT * FROM Chat WHERE id_Sac =" + user.room;

    pool.query(sql ,(err, results, fields) => {
      if (err) {
        const errorMessage =
          err.code === "ER_DUP_ENTRY"
            ? "conta já existente !!!!"
            : "erro interno entre em contato com o fornecedor codigo " + err.code;
      } else {
        for( var a = 0; a < results.length; a++  ){
          if(results[a].audio.length<=0){
            socket.emit('Greetingmessage', formatMessageBack( `${results[a].user}`,`${results[a].data.toLocaleString()}`,  `${results[a].mensagem}`), );
          } else {
            const maudio = '<audio src="' + results[a].audio + '" controls="" id="esteaudio"></audio>'
            socket.emit('Greetingmessage', formatMessageBack( `${results[a].user}`,`${results[a].data.toLocaleString()}`,  `${maudio}`), );
          }
        }
        //res.status(200).send({ mensagem: "transação conlcuida" });
      }
      
    })


    
    
    socket.emit('Greetingmessage', formatMessage(botName , ` ${user.username}, seja bem vindo ao atendimento da Easy+`),); 

    // Transmitir quando um usuário se conectar
    socket.broadcast
        .to(user.room)
        .emit(
         'Greetingmessage', 
         formatMessage(botName , `${user.username} entrou na sala.`)
       );

       // Enviar informações de usuários e salasSend users and room info
       io.to(user.room).emit('roomUsers', {
         room: user.room,
         users: getRoomUsers(user.room) 
       });


    });

    // Carregar mensagem

    // Ouvir chat de mensagens
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        const parte = msg.substring(0,10); 
        if(parte === 'data:audio'){ 
          // será gravado o audio
          const audio = '<audio src="' + msg + '" controls="" id="esteaudio"></audio>'
          io.to(user.room).emit('messageMain', formatMessage(user.username, audio))
          incluirLinhaAudioChat(msg, user.room, user.username)
        } else { 
          io.to(user.room).emit('messageMain', formatMessage(user.username, msg));
          incluirLinhaChat(msg, user.room, user.username)
        }
          
    });

    // Executa quando o cliente desconecta
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
          io.to(user.room).emit(
            'message', 
            formatMessage(botName , `${user.username} saiu da sala.`)
          );
          
       // Enviar informações de usuários e salas
       io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room) 
        });
       }
     });
});

const PORT = 3333 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

