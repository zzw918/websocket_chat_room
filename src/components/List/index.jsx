import React from 'react';

import {connect} from 'react-redux'

import './style.less'

class List extends React.PureComponent {
	constructor(props) {
		super(props);
		this.handleContext = this.handleContext.bind(this);
	}

	handleContext (e) {
		alert('right clicked');
		
		// 防止默认的右键菜单触发
		e.preventDefault();
	}

	render () {
		// 从store中获取到所有的Lists信息，这里渲染出来，list是一个数组
		const {lists, curUserName} = this.props;
		let that = this;
		return <div className="lists-wrap">
			{lists.map((info, index) => {
					return (
						<div className="list-wrap" key={index}>
							<div className="user-info">
								{
									(info[0] == curUserName) ?
									 (
										<span className="user-self" >{info[0] + "(我)"}</span>
									)
									:
									 (
										<span className="user">{info[0]}</span>
									)

								}
								<span className="time">{info[2]}</span>
							</div>
							{
								(info[0] == curUserName) ?
								 (
									<div className="message" onContextMenu = { that.handleContext}>
										{info[1]}
									</div>
								)
								:
								 (
									<div className="message">
										{info[1]}
									</div>
								)

							}
							
						</div>
					)
				})}
			</div>
	}
}

function mapStateToProps(state) {
	return {
		lists: state.handleLists.lists,
		curUserName: state.handleUser.curUsername
	}
}

const Index = connect(
	mapStateToProps
)(List)


export default Index;