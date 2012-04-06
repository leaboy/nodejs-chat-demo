var io = require('socket.io').listen(8000);
var user_client = {};
io.sockets.on('connection', function(socket){
	socket.emit('ready', {msg: 'OK'});
	socket.on('setname', function(data){
		socket.set('nickname', data, function(){
			socket.emit('welcome', data);
		});
		user_client[data.name] = socket;
	});
	socket.on('send', function(data){
		if (data.sendTo) {
			if (user_client[data.sendTo] != 'undefined') {
				user_client[data.sendTo].emit('recive', data);
			} else {
				data.text = 'user "'+data.sendTo+'" is offline or undefined.';
				socket.emit('recive', data);
			}
		} else {
			io.sockets.emit('recive', data);
		}
	});
	socket.on('disconnect', function(){
		socket.get('nickname', function(err, data){
			io.sockets.emit('offline', data);
		});
	});
});