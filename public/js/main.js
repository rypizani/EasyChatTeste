const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const roomForm = document.querySelector('#roomfront');
function scroll() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Obter nome de usuário e sala via URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Entrar na sala de bate-papo
socket.emit('joinRoom', {username, room});

// Obter sala e usuários
socket.on('roomUsers', ({ room, users}) => {
  outputRoomName(room);
  outputUsers(users);  
});

// Mensagem do servidor
socket.on('Greetingmessage', message => {
    outputMessage(message);
    // Rolar para baixo
    scroll()
});

socket.on('messageMain', message => {
  inputMessage(message);
  scroll()

})

// Envio da mensagem
chatForm.addEventListener('submit', e => {
    e.preventDefault();
    
    // Obter texto da mensagem
    // nome do usuário esta na variavel username
    // nome da sala esta na variavel room 
    // texto da mensagem esta na variavel msg 

    const msgtmp = e.target.elements.msg.value;
    if(msgtmp.length > 0 ) {
      socket.emit('chatMessage', e.target.elements.msg.value);
    } else {
      let novoatributo = document.getElementById('esteaudio');
      novoatributo.id = "novo_audio"; 
      //socket.emit('chatMessage', novoatributo);
    }
    

    //socket.emit('chatMessage', msg );

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});



// Mensagem de saída para o front end
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta"> ${message?.username} <span>‎‎ ${message?.time}</span></p>
  <p class="text">
  ${message?.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);

};

//
function inputMessage(message) {
const div = document.createElement('div');
div.classList.add('message');
div.innerHTML = `<p class="meta"> ${message?.username} <span>‎‎ ${message?.time}</span></p>
<p class="text">${message?.text}</p>`;
document.querySelector('.chat-messages').appendChild(div);    
}; 

// Adicionar o nome da sala ao front end
function outputRoomName(room) {
  roomName.innerText = room;
}

// Adicionar usuários ao front end
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}