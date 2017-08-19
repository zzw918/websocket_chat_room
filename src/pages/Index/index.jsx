import React from 'react';

import { connect } from 'react-redux'
import store from '../../redux/Store'
import {tempLog} from '../../redux/Action'

import { Link, browserHistory} from 'react-router'

import './style.less'

class Indexooo extends React.PureComponent {
	// 这里使用 constructor 的目的是可以使用当前组e件的 state ，这个 state 不是共享的，而只是在组件内部使用的。
	constructor(props) {
		super(props);
		this.state = {
			tempName: ''
		}
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		document.querySelector('#indexName').focus();
		document.addEventListener('keydown', this.enterLogin);
	}

	enterLogin (e) {
	    if(!e) {
	    	e = window.event;
	    }
	    if((e.keyCode || e.which) == 13){ 
	        browserHistory.push('/login');
	    } 
	}

	getCurName (text) {
		this.props.getTheCurName(text);
	}

	handleChange (event) {
		this.setState({tempName: event.target.value});
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.enterLogin);
	}

	render () {
		const {dispatch} = this.props;
		return (
			<div className="log-wrap">
				<h2>Welcome to <span> Wayne Chat!</span></h2>
				<div className="choose-log">
					<input type="text" placeholder="昵称" id="indexName" onChange={ this.handleChange }/>
					<Link  to="/register"><span className="sign-up" onClick={ this.getCurName(this.state.tempName)}>注册</span></Link>
					<span>or</span>
					<Link  to="/login"><span className="sign-in">登录</span></Link>
				</div>
			</div>	
		);
	}
}

function mapDispatchToProps(dispatch) {
    return {
      getTheCurName: (text) => dispatch(
       	tempLog(text)
      )
    }
}

function mapStateToProps(state) {
    return {
      value: state
    }
}

const Index = connect(
    mapStateToProps,
    mapDispatchToProps
)(Indexooo)

export default Index;