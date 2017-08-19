import React from 'react';
import Lists from '../../components/List'

import {connect} from 'react-redux'
import {addList, updateNumber, deleteMsgs} from '../../redux/Action'
import {initAllRooms, addNewRoomName} from '../../redux/Action'
import {updateCurRoomName} from '../../redux/Action'

import {browserHistory} from 'react-router'

import {message} from 'antd'
import './style.less'

class App extends React.PureComponent{

	constructor(props) {
		super(props);
		this.state = {
			text : "", 
			showMedel: false
		}
	    this.handleChange = this.handleChange.bind(this);
	    this.sendText = this.sendText.bind(this);
	    this.createRoom = this.createRoom.bind(this);
	    this.cancelCreate = this.cancelCreate.bind(this);
	    this.confirmCreate = this.confirmCreate.bind(this);
	    this.receiveNewText = this.receiveNewText.bind(this);
	    this.sendTextKeydown = this.sendTextKeydown.bind(this);
	}

	componentWillMount() {
		const {curUserName} = this.props;
		// 开发添加房间过程中先关掉，后续添加
		if ('' == curUserName) {
			browserHistory.push('/');
		}
	}

	componentDidMount() {		
		document.querySelector('#textarea').focus();
		let that = this;
		const {curUserName} = this.props;

		// 在挂载完成之后，我们就可以开始进行连接socket.io了。
		if (typeof io !== 'undefined') {
	        this.socket = io.connect();
	        this.socket.on('connect',() => {
	            console.log('客户端链接socket成功')
	        });
	        // 通过login将当前用户名传递 && 并通过此在后台统计在线人数
	        this.socket.emit('curUserName', curUserName);
	        this.socket.on('error', (err) => {
	        	console.log('客户端链接socket失败：', err)
	        });
	        // 接收从后台推送过来的信息
	        let that = this;
	        // 接收后台发送的当前的人数变化
	        this.socket.on('userNumber', (userNumber) => {
	        	that.props.updateUserNumber(userNumber);
			});
					
			const doc = document;
					
	        // 接收后台对于所有聊天室的推送，然后把第一个room的名称添加到curRoom中去
	        this.socket.on('allRooms', (allRooms) => {
	        	that.props.addAllRooms(allRooms);
	        	let curRoom = allRooms[0].name;
	        	that.props.updateCurRoom(curRoom);
	        });

	        // 接收后台对于历史消息的推送
	        this.socket.on('historyMsg', (info) => {
	        	that.props.addNewList(info);
				doc.querySelector('.lists-wrap').scrollTop = doc.querySelector('.lists-wrap').scrollHeight - doc.querySelector('.lists-wrap').clientHeight
	        });

	        // 接收新的房间
	        this.socket.on('newRoom', (room) => {
				that.props.addNewRoom(room);
	        });

            this.socket.on('newText', (info) => {
            	console.log(info)
            	// 如果服务器发送过来的房间和当前房间一致，就添加； 否则，不添加。
            	that.receiveNewText(info);
            });

		}

		document.addEventListener('keydown', that.sendTextKeydown);
	}

	// 这个函数虽然不是事件触发的函数，但是通过这个函数，可以成功的解决问题。
	receiveNewText(info) {
		const {curRoomName} = this.props;
		const doc = document;
    	if (info[3] == curRoomName) {
        	this.props.addNewList(info);
			doc.querySelector('.lists-wrap').scrollTop = doc.querySelector('.lists-wrap').scrollHeight - doc.querySelector('.lists-wrap').clientHeight
    	}
	}

	// 设置text值，方便获取文字信息
	handleChange (event) {
		this.setState({text: event.target.value});
	}

	sendTextKeydown (e) {
		if(!e) {
			e = window.event;
		}
		if((e.keyCode || e.which) == 13){ 
			e.returnValue = false;
		    this.sendText();
		} 
	}
	
	// 发送信息
	sendText () { 
		const {curUserName, curRoomName} = this.props;

		// 在发送消息时，需要标注room名称，这样数据库才能根据不同的room存储到不同的集合
		// 因为只能传递字符串，所以选择传递json字符串
		let sendMsg = {
			text: this.state.text,
			room: curRoomName
		}

		this.socket.emit('sendText', JSON.stringify(sendMsg));

		// 将用户发送的信息存放在仓库中
		// 在这个info数组中分别存储 用户名、发送的文字、当前时间、以及所在的房间
    	let info = [curUserName, this.state.text, new Date().toLocaleString()];
		this.props.addNewList(info);

		// 发送信息之后，将textarea中的文字清空
		document.querySelector('#textarea').value = '';

		// 每次都将最新消息可以看到
		document.querySelector('.lists-wrap').scrollTop = document.querySelector('.lists-wrap').scrollHeight - document.querySelector('.lists-wrap').clientHeight + 30;
	}

	//  创建房间
	//  创建新房间打开窗口，然后将房间的内容添加到redux中，接着我们还可以向数据库添加。
	createRoom () {
		this.state.showMedel = true;
		// 只是修改了state但是没有渲染，所以我们使用forceUpdate() 强行渲染
		this.forceUpdate();
	}

	cancelCreate () {
		this.state.showMedel = false;
		// 只是修改了state但是没有渲染，所以我们使用forceUpdate() 强行渲染
		this.forceUpdate();
	}

	// 用户确定创建新的房间
	confirmCreate () {
		let that = this;
		let roomName = document.querySelector('#newRoomName').value;
		if (roomName == '') {
			message.error('新建聊天室名称不能为空！');
			// 自动确定焦点
			document.querySelector('#newRoomName').focus();
		} else {
			// 我们还是使用websocket来发送请求，看看是否可以解决问题。
			this.socket.emit('ifChatRoomRepeat', roomName);
			this.socket.on('confirmIfRepeat', (text) => {
				switch (text) {
					case 'error': 
						message.warning('服务器端错误，请稍后重试！');
						that.state.showMedel = false;
						that.forceUpdate();
						break;
					case 'true': 
						message.warning('此名称重复！请选择其他名称');
						break;
					case 'false': 
						that.socket.emit('postChatRoom', roomName);
						that.state.showMedel = false;
						that.forceUpdate();
						message.success('创建成功！');
						// 成功之后，应当将room添加到当前的state中，然后在发送到服务器，由服务器发送到各个客户端。
						that.props.addNewRoom(roomName);
						break;
					default: 
						return;
				}
			});
		}
	}

	changeRoom (room) {
		// 切换房间时需要做的步骤 --- 第一：将页面的curName替换为当前的curName。 第二： 将存储在本地的历史信息先全部清除。  第三： 向服务器端请求
		// 服务器端通过websocket将相应name下的聊天记录推送到客户端并替换本地之前的数据。 
    	this.props.updateCurRoom(room.name);

    	// 第二： 先清除掉本地redux中所有的相关聊天信息
    	this.props.deleteAllMsgs([]);
    	console.log('切换聊天室：', room.name)

    	// 告诉服务器：我要更换聊天室了，你要给我新的聊天室的数据啊
    	this.socket.emit('changeRoom', room.name);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', that.sendTextKeydown);
	}

	render () {
		const {curUserName, curUserNumber, allRooms, curRoomName} = this.props;
		const that = this;
		return (
			<div className="chat-wrap">
				<div className="channels">
					<div className="title">Wayne chat</div>
					<div className="cur-user">欢迎你，{curUserName}</div>
					<div className="choose-channel">
						<div className="channel">
							<span>所有房间</span>
							<img src="/images/add.png" className="create" onClick={this.createRoom}/>
						</div>
						<ul className="lists">
							{allRooms.map(function (room, index) {
									return (
										<li key={index} onClick={ () => that.changeRoom(room) }>{index + 1}、{room.name}</li>
									)
								})}
							<li className="getAll">已获取所有聊天室</li>
						</ul>
					</div>
				</div>
				<div className="room">
					<div className="name">{curRoomName}({curUserNumber})</div>
					<div className="chat-room">
						<Lists/>
					</div>
					<div className="chat-form">
						<textarea onChange={this.handleChange} id="textarea">
							
						</textarea>
						<div className="img">
							<span className="emoji"></span>
							<span className="space"></span>
							<span className="picture"></span>
						</div>
						<div className="send" onClick={ this.sendText }>发送(S)</div>
					</div>
				</div>

				{
					this.state.showMedel && (
						<div>
							<div className="create-chat">
								<div className="close" onClick={ this.cancelCreate }>取消</div>
								<div className="title">创建新房间</div>
								<div className="create-input">
									<input type="text" id="newRoomName"/> 
									<span onClick={this.confirmCreate}>确定</span>
								</div>
							</div>
							<div className="model"></div>
						</div>
					)
				}

			</div>
			)
	}
}

// dispatch到仓库中,实际上就是改变仓库中的数据
function mapDispatchToProps(dispatch) {
	return {
		addNewList: (info) => dispatch(
			addList(info)
		),
		updateUserNumber: (userNumber) => dispatch(
			updateNumber(userNumber)
		),
		addAllRooms: (allRooms) => dispatch(
			initAllRooms(allRooms)
		),	
		updateCurRoom: (curRoomName) => dispatch(
			updateCurRoomName(curRoomName)
		),
		deleteAllMsgs: (newList) => dispatch(
			deleteMsgs(newList)
		),
		addNewRoom: (newRoom) => dispatch(
			addNewRoomName(newRoom)
		)

	}
}

// 从redux仓库中获取到state
function mapStateToProps(state) {
  return {
    curUserName: state.handleUser.curUsername,
	curUserNumber: state.handleUser.curUserNumber,
	allRooms: state.handleRooms.allRooms,
	curRoomName: state.handleCurName.curRoomName
  }
}

const Index = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default Index;