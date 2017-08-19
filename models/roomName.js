let mongodb = require('./db.js');

// 创建RoomName对象
let RoomName = {};

// 导出此RoomName对象
module.exports = RoomName;

// 根据名称在集合 allRooms 中查找某一个聊天室是否存在
// 这个集合的数据结构很简单，每一个文档即 name: '聊天室名称', time: 1970年来的时间戳
RoomName.getOne = (name, callback) => {
	mongodb.open((err, db) => {
		if (err) {
			return callback(err);
		}
		db.collection('allRooms', (err, collection) => {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				name: name
			}, (err, one) => {
				mongodb.close();
				if (err) {
					return callback(err);
				} else {
					callback(null, one);
				}
			});
		});
	})
}

RoomName.saveOne = (nameObj, callback) => {
	mongodb.open((err, db) => {
		if (err) {
			return callback(err)
		}
		db.collection('allRooms', (err, collection) => {
			if (err) {
				mongodb.close()
				return callback(err)
			}
			collection.insert(nameObj, (err) => {
				mongodb.close();
				if (err) {
					return callback(err)
				}
				callback(null)
			})
		})
	})
}

RoomName.getAllRoomName = (callback) => {
	mongodb.open((err, db) => {
		if (err) {
			return callback(err);
		}
		db.collection('allRooms', (err, collection) => {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.find({}).sort({
				time: 1
			}).toArray((err, rooms) => {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null, rooms);
			})
		})
	});
}