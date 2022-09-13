const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());
app.ws('/', (ws, res) => {
    console.log('ROOT CONNECT');
    ws.on('message', (msg) => {
        const messageData = JSON.parse(msg)
        switch (messageData.method){
            case 'connection':
                connectionHandler(ws, messageData);
                break;
            case 'draw':
                console.log(messageData);
                broadcastConnection(ws, messageData);
                break;
        }
    })
})

app.post('/image', (req,res) => {
    try{
        const data = req.body.img.replace('data:image/png;base64,', '');
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64');
        return res.status(200).json({message: 'saved'});
    } catch (e){
        return res.status(500).json('error')
    }
});

app.get('/image', (req,res) => {
    try{
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        const data = 'data:image/png;base64,' + file.toString('base64');
        res.json(data);
    } catch (e){
        return res.status(500).json('error')
    }
});

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
            client.send(JSON.stringify(messageData));
        }
    })
}