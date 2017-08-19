// index页的数据保存
export const ADD_TEMP = 'ADD_TEMP'
export const ADD_CUR_USER = 'ADD_CUR_USER'
export const ADD_LIST = 'ADD_LIST'
export const UPDATE_NUMBER = 'UPDATE_NUMBER'
export const INIT_ALLROOMS = 'INIT_ALLROOMS'
export const UPDATE_CUR_NAME = 'UPDATE_CUR_NAME'
export const DELETE_ALL_MSGS = 'DELETE_ALL_MSGS'
export const ADD_NEW_ROOM = 'ADD_NEW_ROOM'

// 导出action生成函数，在dispatch时来生成action。
export function tempLog  (text) {
	return {
		type: ADD_TEMP,
		text: text		
	}
}

// 登录或注册成功之后将name添加到store中。
export function addCurUser (name) {
	return {
		type: ADD_CUR_USER,
		text: name
	}
}	

// 在发出消息或者接收到消息之后将信息发送到state
// type属性是必须的，而info、text这一类根据需要自己定义即可。
export function addList (info) {
	return {
		type: ADD_LIST,
		info: info
	}
}

// 清空本地的所有信息，提高用户体验
export function deleteMsgs (newList) {
	return {
		type: DELETE_ALL_MSGS,
		list: newList
	}
}

// 更新在线人数
export function updateNumber(number) {
	return {
		type: UPDATE_NUMBER,
		number: number
	}
}

// 开始获取所有的聊天室
export function initAllRooms (allRooms) {
	return {
		type: INIT_ALLROOMS,
		data: allRooms
	}
}

// 添加一个新的room
export function addNewRoomName (newRoom) {
	return {
		type: ADD_NEW_ROOM,
		text: newRoom
	}
}

// 更新当前的聊天室名称
export function updateCurRoomName (curName) {
	return {
		type: UPDATE_CUR_NAME,
		name: curName
	}
}

