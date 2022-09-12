const btn = document.querySelector("#btn");
const socket = new WebSocket('ws://localhost:5000/');

socket.onopen = () => {
    socket.send(JSON.stringify({
        message: 'Hello from client to server',
        method: 'connection',
        id: 555,
        username: 'Me'
    }));
}

socket.onmessage = (event) => {
    console.log('server response:', event.data);
}

btn.onclick = () => {
    socket.send(JSON.stringify({
        message: 'Hello from client to server',
        method: 'message',
        id: 555,
        username: 'Me'
    }));
}