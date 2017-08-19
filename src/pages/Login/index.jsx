import React from 'react';
import Log from '../../components/Log'

import { connect } from 'react-redux'

import {browserHistory} from 'react-router'

class Login extends React.PureComponent {
  	render () {
	    	const {tempName} = this.props;
	    	return (
		      	<Log signStyle='登录' tempName={tempName} isUp={false}/>
	    	);
	  }
}

function mapStateToProps(state) {
	  return {
   		 tempName: state.handleUser.tempName
 	  }
}

const Index = connect(
    mapStateToProps
)(Login)

export default Index;