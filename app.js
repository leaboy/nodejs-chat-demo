var io = require('socket.io').listen(8000);
var user_name = [];
var user_client = {};
io.sockets.on('connection', function(socket){
	socket.emit('ready', {msg: 'OK'});
	socket.on('setname', function(data){
		socket.set('nickname', data, function(){
			socket.emit('welcome', data);
		});
		user_name.push(data.name);
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
			if (data) {
				user_name.remove(data.name);
				io.sockets.emit('offline', data);
			}
		});
	});
});

setInterval(function(){
	io.sockets.emit('onlineUserUpdate', user_name);
}, 30000);

Array.prototype.remove = function(n){if(isNaN(parseInt(n))) return false;if(n>=this.length || n<0) return false;for(i=n;i<this.length-1;i++) this[i]=this[i+1];this.pop();return true;}