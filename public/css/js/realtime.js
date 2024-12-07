const socket = io();
socket.on('connect', () => {
    console.log('Conectado al servidor en tiempo real');
});
