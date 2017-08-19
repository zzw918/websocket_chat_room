import React from "react";
import ReactDom from 'react-dom'
import App from './pages/App'
import Login from './pages/Login'
import Register from './pages/Register'
import Index from './pages/Index'

import {Provider} from 'react-redux'
import store from './redux/Store'

import { Router, Route, Link,  IndexRoute, hashHistory, browserHistory } from 'react-router'


ReactDom.render(
	(
	<Provider store={store}>
	  <Router history={browserHistory}>
	    <Route path="/" component={Index}/>
	    <Route path="/login" component={Login} />
	    <Route path="/register"  component={Register} />
	    <Route path="/app" component={App} />
	  </Router>
	</Provider>
	),
	document.querySelector('#app')
)