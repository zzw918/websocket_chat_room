import {combineReducers} from 'redux'
import {ADD_TEMP, ADD_CUR_USER, UPDATE_NUMBER} from '../Action'
import {ADD_LIST} from '../Action/'
import {INIT_ALLROOMS} from '../Action'

// handleUser定义与用户相关的reducer
function handleUser(state = { tempName: '' , curUsername: '', curUserNumber: 0}, action) {
    switch (action.type) {
        case 'ADD_TEMP':
        	// 先将当前的的暂时名称存储起来。
        	state.tempName = action.text;
            return state;
        case "ADD_CUR_USER":
            state.curUsername = action.text;
            // return 之后就不需要break了。
            return state;
        case "UPDATE_NUMBER": 
            state.curUserNumber = action.number;
            return state;
        default:
            return state;
    }
}

// 定义信息的相关
function handleLists(state = {lists: []}, action) {
    
    switch (action.type) {
        case 'ADD_LIST':
            // 关键：这里因为Lists是数组，地址不会改变，即使值发生了变化。
            // 所以，我们需要创建一个新的数组。
            // state.lists.push(action.info);
            const newList = Object.assign([], state.lists);
            newList.push(action.info);
            return {lists: newList};
        case 'DELETE_ALL_MSGS': 
            const newNullList = action.list
            return {lists: newNullList}
        default: 
            return state;
    }

}


// 定义聊天室相关
function handleRooms(state = { allRooms: [] }, action) {
    switch (action.type) {
        case 'INIT_ALLROOMS': 
            let newInitRooms = Object.assign([], action.data);
            return {allRooms: newInitRooms}
        case 'ADD_NEW_ROOM':
            let newRoom = {
                name: action.text
            }
            const brandNewRoom = Object.assign([], state.allRooms);
            brandNewRoom.push(newRoom);
            return {allRooms: brandNewRoom};
        default:    
            return state;
    }
}   

function handleCurName(state = { curRoomName: "" }, action) {
    switch (action.type) {
        case 'UPDATE_CUR_NAME': 
            state.curRoomName = action.name;
            return state;
        default: 
            return state;
    }
}   

const storeReducer = combineReducers({
    handleUser,
    handleLists,
    handleRooms,
    handleCurName
});

export default storeReducer;