import { ADD_TODO, TOGGLE_TODO } from '../actions/actionTypes.jsx';

export const initialState = {
  id: -1,
  todos: []
};
const handlers = {
  [ADD_TODO]: (state, action) => ({
    ...state,
    id : ++state.id,
    todos: [...state.todos, { id: state.id, text : action.todoText, completed : false }]
  }),
  [TOGGLE_TODO]: (state, action) => ({
    ...state,
    todos: state.todos.map((todo, index) => {
      if (index === action.id) {
        todo = {...todo, completed: !todo.completed};
      }
      return todo;
    })
  })
};

export default function todoReducer(state = initialState, action) {
  let handler = handlers[action.type];
  if(!handler) return state;
  return { ...state, ...handler(state, action)};
}
