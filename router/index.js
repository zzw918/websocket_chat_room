let express = require('express');

// 这里的router不仅适合用于使用jade渲染的博客系统，也适用于api的使用。
let router = express.Router();

let User = require('../models/user.js');

let RoomName = require('../models/roomName.js');

module.exports = router;


/* 对客户端的返回数据封装
 * @param [code] (number) code为返回的状态码
 * @param [message] (string) message为返回的信息
 * @param [data] (any) data是可选的，为返回给前端的数据
 */

 // 注意： retrunJson中的res为node处理接口的回调函数中的res，这个是必须的。
function returnJson(res, code, message, data) {
	let response = {
		code: code,
		message: message
	}
	if (typeof data !== 'undefined') {
		response.data = data
	}
	res.json(response);
}

router.post('/register', (req, res) => {
	let userName = req.body.userName,
	    password = req.body.password,
	    passwordAgain = req.body.passwordAgain;

	// 检查两次的注册密码是否一致
	if (password == passwordAgain) {
		let newUser = new User({
			name: userName,
			password: password
		});

		// 现在数据库中查找该用户是否存在
		User.find(userName, (err, user) => {
			if (err) {
				returnJson(res, 5001, "服务器错误，注册失败");
			} else {
				if (user !== null) {
					returnJson(res, 4003, "此用户已经注册！");
				} else {
					// 如果符合条件，就注册该用户，将数据保存在数据库。
					newUser.save( (err, user) => {
						if (err) {
							// 服务器端错误，失败返回状态码500
							returnJson(res, 500, "用户注册失败！");
						} else {
							// user数据较简单，直接传递user即可，如果复杂，我们可以考虑使用对象形式传递更多数据。
							returnJson(res, 200, "用户注册成功！", user);
						}
					});
				}
			}
		})

	} else {
		// 400错误是客户端请求的参数无法被服务器端理解，而这里是用户输入密码不一致，也属于客户端错误，自定义为4001
		returnJson(res, 4001, "用户两次输入密码不一致！");
	}
});

router.post('/login', (req, res) => {
	let userName = req.body.userName,
	    password = req.body.password;

	User.find(userName , (err, user) => {
		if (err) {
			returnJson(res, 5001, "服务器错误，登录失败");
		} else {
			if (user == null) {

				returnJson(res, 2001, '用户未注册');

			} else {

				if (password == user.password) {
		
					returnJson(res, 200, "登录成功！", user);

				} else {
		
					returnJson(res, 4002, "密码输入有误！");

				}
			}
		}
	});
});
