const moment = require('moment');

let Oldmessages = [];



function formatMessage(username, text) {
    Oldmessages.push({
        username,
        text,
        time: moment().format("HH:mm DD/MM/YYYY")
    })
    

    return{
        username,
        text,
        time: moment().format("HH:mm DD/MM/YYYY")
    } 

}
function formatMessageBack(username, tempo, text) {
    Oldmessages.push({
        username,
        text,
        time: tempo
    })
    

    return{
        username,
        text,
        time: tempo
    } 
}



module.exports = {
    formatMessage,
    Oldmessages,
    formatMessageBack,
};