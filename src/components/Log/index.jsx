import React from 'react';

import { connect } from 'react-redux'
import {addCurUser} from '../../redux/Action'

import {Link, Lifecycle, browserHistory } from 'react-router'

import { message } from 'antd';
import './style.less'

class Log extends React.PureComponent {	

	constructor(props) {
	  super(props);
	  this.state = {
	  	userName : "",
	  	password : "",
	  	passwordAgain : ""
	  }
	  this.handleChangeUser = this.handleChangeUser.bind(this);
	  this.handleChangePass = this.handleChangePass.bind(this);
	  this.handleChangePassAgain = this.handleChangePassAgain.bind(this);

	  this.handleLog = this.handleLog.bind(this);
	}

	componentDidMount() {
		document.querySelector('#passwordInput').focus();
	}

	// 通过对 onchange 事件的监控，我们可以使用react独特的方式来获取到value值。 
	handleChangeUser (event) {
		this.setState({userName: event.target.value});
	}
	handleChangePass (event) {
		this.setState({password: event.target.value});
	}
	handleChangePassAgain (event) {
		this.setState({passwordAgain: event.target.value});
	}

	handleLog (e) {
		// 使用event的目的在于阻止默认。
		// var logEvent = e;
		// e.preventDefault();

		// 在后面使用redux时使用
		let that = this;

		// 如果为注册，则up为true，否则，up为false
		let up = this.props.isUp;

		// 提交注册时，我们可以将当前所有的数据拿到

		// 这种方法可以解决从首页传递来的数据无法正常使用的问题。
		let userName;
		if (this.state.userName === "") {
			 userName = this.props.tempName;
		} else {
			 userName = this.state.userName;
		}
		let	password = this.state.password;

		let postObj = {
			userName: userName,
			password: password
		}

		// 如果是注册，则需要获取到确认密码。
		if (up) {
			let	passwordAgain = this.state.passwordAgain;

			postObj.passwordAgain = passwordAgain;

			// console.log('注册', userName, password, passwordAgain)
			fetch('/register', {
			    method: "POST",
			    headers: {
			        'Content-Type': 'application/x-www-form-urlencoded'
			    },
			    body: `userName=${postObj.userName}&password=${postObj.password}&passwordAgain=${postObj.passwordAgain}`
			}).then((res) => {
			    return res.json();
			}).then((data) => {
				switch (data.code) {
					case 200:
						message.success('注册成功！');
						// 注册成功时，我们需要将用户的 userName 存储到 store 中
						that.props.getCurUsername(data.data.name);
						browserHistory.push('/app');
						break;
					case 4001: 
						message.error('两次输入密码不一致！');
						break;
					case 4003: 
						message.error('此用户已经注册！');
						break;
					case 5001:
						message.error('服务器错误，注册失败');
						break;
					case 500:
						message.error('服务器出错，请稍后重试！');
						break;
					default:
						return;

				}
			});
		// 如果是登录，就只需要用户名和密码
		} else {
			// console.log('登录',userName, password)
			fetch('/login', {
			    method: 'POST',
			    headers: {
			        'Content-Type': 'application/x-www-form-urlencoded'
			    },
			    body: `userName=${postObj.userName}&password=${postObj.password}`
			}).then((res) => {
				return res.json();
			}).then((data) => {
				switch (data.code) {
					case 200:
						message.success('登录成功！');
						// 同理，登录成功之后，我们也需要将当前的用户名称添加到store中。 
						that.props.getCurUsername(data.data.name);
						browserHistory.push('/app');
						break;
					case 4002: 
						message.error('密码输入有误！');
						break;
					case 2001: 
						message.error('该用户未注册！');
						break;
					case 5001:
						message.error('服务器错误，注册失败');
						break;
					default:
						return;
				}
			});
		}
	}

	render () {
		let bool = this.props.isUp;
		return (
			<div className="sign-wrap">
				<h2>Wayne Chat</h2>
				<div className="form-control">
					<label>用户名</label><br/>
					<input type='text' defaultValue={this.props.tempName} onChange={ this.handleChangeUser }/>
				</div>
				<div className="form-control">
					<label>密码</label><br/>
					<input type="password" id="passwordInput" onChange={ this.handleChangePass } />
				</div>
				{
				    !!bool &&
					<div className="form-control">
						<label>确认密码</label><br/>
						<input type="password" onChange = {this.handleChangePassAgain} />
					</div>
				}
				<div className="form-control">
					<div className="sub-btn" onClick={ this.handleLog }>{this.props.signStyle}</div>
				</div>
			</div>	

		);
	}
}

function mapDispatchToProps(dispatch) {
  return {
    getCurUsername: (text) => dispatch(
    	addCurUser(text)
    )
  }
}

const Index = connect(
  null,
  mapDispatchToProps
)(Log)


export default Index;