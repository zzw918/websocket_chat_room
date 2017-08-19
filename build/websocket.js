// 统计总人数
let userNumber = 0;

let RoomName = require('../models/roomName.js');
let Rooms = require('../models/rooms.js');

function WebSocket(io) {

	// 一旦链接socket，在回调函数中有一个当前的socket实例。而服务器是针对很多用户的，所以说：每当一个用户连接进入，下面的代码就会被调用。
	io.sockets.on('connection', (socket) => {

	    // user leave 
	    socket.on('disconnect', () => {

	    	// 新用户推出，则总数减1
	    	userNumber--;
			console.log('在线人数',userNumber)

	    	// 一旦用户人数发生变化，向所有客户端通知
	    	io.sockets.emit('userNumber', userNumber);
	        console.log(socket.userName,' leave!')

	    });

		socket.on('curUserName', (curUserName) => {
			// 新用户进入，则总数加1，并向所有客户端通知
			userNumber++;
			io.sockets.emit('userNumber', userNumber);
			socket.userName = curUserName;
			console.log(socket.userName, '连接websocket服务器')

			// 首先获取所有的聊天室，然后再默认其中一个的信息
			// 从RoomName集合中获取到所有的聊天室名称。 其顺序是按照时间进行排序的，所以存储名称外，还要存储创建时间：
			setTimeout(function () {
				RoomName.getAllRoomName((err, rooms) => {
					if (err) {
						console.log(err)
					} else {
						// 将所有信息直接发送过去，前端的可扩展性更好一些,rooms就是数组
						io.sockets.emit("allRooms", rooms);

						// 在这里选择一个room（最近或者最晚）的推送给前端
						// 获取某个房间中的所有信息，其中的msgs是按照时间进行排序的。
						Rooms.getAllMsgs( rooms[0].name , (err, msgs) => {
							if (err) {
								console.log(err)
							}
							// 这里的msgs是按照时间排序的数组，其每一个元素是对象。
							msgs.forEach((obj) => {  
								let info = [obj.name, obj.text, new Date(Number(obj.time)).toLocaleString()];

								// 将历史信息向所有的客户端推送
								io.sockets.emit('historyMsg', info);
							});
						});
					}
				});
			}, 100);


		}); 

		// 接收客户端发送过来的请求, 这里的text一个是一个json字符串，解析为一个对象： text以及room
		socket.on('sendText', (text) => {

			let parsedObj = JSON.parse(text);

			console.log(socket.userName + '说: ' + parsedObj.text)

			// 使用这种方式存储数据，可以在数据库中排序然后发送到前台。
			let date = new Date();

			// 存储用户名、信息和当前时间以及此信息所来自的用户
			let info = [socket.userName, parsedObj.text, date.toLocaleString(), parsedObj.room];
			socket.broadcast.emit('newText', info);

			// info 是一个数组，在存储数据库时ch，需要将其转化为对象
			let obj = {
				name: info[0],
				text: info[1],
				time: date.getTime()
			}

			// 为了在刷新之后我们还可以获取到数据，所以对于每条数据，应当存储在数据库中。
			Rooms.save(parsedObj.room, obj, (err) => {
				if (err) {
					console.log(err)
				}
			});
		});


		// 当用户创建新房间时，将房间名添加到数据库中， 并将该房间广播给所有用户
		socket.on('postChatRoom', (name) => {
			// 添加到RoomName数据库中。
			let time = new Date().getTime(),
				nameObj = {
					name: name,
					time: time
				};

			RoomName.saveOne(nameObj, (err) => {
				if (err) {
					console.log('存储房间失败')
				} else {
					console.log('存储房间成功')
				}
			});
			console.log('存储房间成功', name)

			// 广播给其他用户
			socket.broadcast.emit('newRoom', nameObj.name);
		});

		// 接收客户端发送来的确认名称请求，进行数据库查询
		socket.on('ifChatRoomRepeat', (roomName) => {
			RoomName.getOne(roomName, (err, one) => {
				if (err) {
					socket.emit('confirmIfRepeat', 'error');
				} else {
					if (one == null) {
						socket.emit('confirmIfRepeat', 'false');
					} else {
						socket.emit('confirmIfRepeat', 'true');
					}
				}
			});
		});

		// 用户更换聊天室，发送新的聊天室的历史记录给客户
		socket.on('changeRoom', (curRoom) => {
			Rooms.getAllMsgs( curRoom , (err, msgs) => {
				if (err) {
					console.log(err)
				}
				// 这里的msgs是按照时间排序的数组，其每一个元素是对象。
				msgs.forEach((obj) => {  
					let info = [obj.name, obj.text, new Date(Number(obj.time)).toLocaleString()];

					// 将此聊天信息只推送给发出这个请求的人。
					socket.emit('historyMsg', info);
				});
			});
		}) 

	});
}

module.exports = WebSocket;