import {
	ADD_TODO,
	TOGGLE_TODO
} from './actionTypes.jsx';

export function addTodo(todoText) {
  return dispatch => {
    dispatch({type: ADD_TODO, todoText});
  };
}

export function toggleTodo(id) {
  return dispatch => {
    dispatch({type: TOGGLE_TODO, id});
  };
}
