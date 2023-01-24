const users = [];

// Junte-se para conversar 
function userJoin(id, username, room ) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

//
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// O usuário sai do bate-papo
function userLeave(id){
   const index = users.findIndex(user => user.id === id);
   
   if(index !== -1){
    return users.splice(index, 1)[0];
   }
}

// Obter usuários da sala
function getRoomUsers(room){
  return users.filter(user => user.room === room);  
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};



