import React from 'react';
import { Router, Route } from 'react-router';
import StargazersContainer from './containers/StargazersContainer.jsx';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import About from './components/About.jsx';
import TodoApp from './components/TodoApp.jsx';
import Extras from './components/Extras.jsx';
import Index from './components/Index.jsx';

/**
 * The React Routes for both the server and the client.
 */
module.exports = (
	<Router>
		<Route path="/index" component={Index} />
		<Route component={StargazersContainer}>
			<Route component={Header}>
				<Route path="/home" component={Home} />
				<Route path="/about" component={About} />
				<Route path="/todo" component={TodoApp} />
			  <Route path="/extras" component={Extras} />
			</Route>
		</Route>
	</Router>
);
