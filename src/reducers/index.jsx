import { combineReducers } from 'redux';
import stargazers from './stargazers.jsx';
import todos from './todos.jsx';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  stargazers,
  todos,
  routing: routerReducer
});

export default rootReducer;
