var socket = require('socket.io-client')('http://165.227.182.7:3000/');

socket.on('connect', function(){
  console.log('connected');
});

socket.on('profit', function(profit) {
  console.log(profit);
});

socket.on('event', function(data){});
socket.on('disconnect', function(){});

