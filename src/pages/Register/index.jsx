import React from 'react';
import Log from '../../components/Log/'

import {connect}  from 'react-redux'

class Register extends React.PureComponent {
	render () {
		const {tempName} = this.props;
		return (
			<Log signStyle="注册" tempName={tempName} isUp={true}/>
		);
	}
}

// 从redux仓库中获取到state
function mapStateToProps(state) {
  	return {
  	 	tempName: state.handleUser.tempName
 	}
}

const Index = connect(
    mapStateToProps
)(Register)

export default Index;