const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();

const PORT = process.env.PORT || 5000;

app.ws('/', (ws, res) => {
    console.log('ROOT CONNECT');
    ws.send('user here');
    ws.on('message', (msg) => {
        const messageData = JSON.parse(msg)
        switch (messageData.method){
            case 'connection':
                connectionHandler(ws, messageData);
                break;
            case 'message':
        }
        console.log(messageData.message, messageData.username);
    })
})

app.listen(PORT, () => {
    console.log('START');
})

const connectionHandler = (ws, messageData) => {
    ws.id = messageData.id;
    broadcastConnection(ws, messageData);
}

const broadcastConnection = (ws, messageData) => {
    aWss.clients.forEach(client => {
        if(client.id === messageData.id){
            client.send(`User ${messageData.username} connected`);
        }
    })
}