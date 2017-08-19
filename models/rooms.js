'use strict'

// 此js文件用于存储多个聊天室
let mongodb = require('./db.js');

let Rooms = {};

// 导出此Rooms对象
module.exports = Rooms;

// save方法接收三个参数：
// room: 即聊天室名称
// info: 即一次聊天的基本信息, 这里的info为对象形式，即将之前的数组当做键值对中的值，并封装在对象中。
// callback: 即处理错误的函数，出现错误及时反馈
	
Rooms.save = (room, info, callback) => {
	mongodb.open((err, db) => {
		if (err) {
			return callback(err);
		}
		db.collection(room, (err, collection) => {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.insert(info, (err) => {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		})
	})
}

Rooms.getAllMsgs =  (room, callback) => {
	mongodb.open( (err, db) => {
		if (err) {
			return callback(err);
		}
		db.collection(room,  (err, collection) => {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.find({}).sort({
				time: 1
			}).toArray((err, msgs) => {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null, msgs);
			});
		});

	});
}