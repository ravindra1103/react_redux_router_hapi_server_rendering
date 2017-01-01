import React, { Component } from 'react';
import { addTodo } from '../actions/todos.jsx';
import TodosList from './TodosList.jsx';
import AddTodo from './AddTodo.jsx';
import { connect } from 'react-redux';

export class TodoApp extends Component {
  constructor(props) {
    super (props);
    this._handleAddTodo = this._handleAddTodo.bind(this);
  }
  _handleAddTodo(text) {
    this.props.dispatch(addTodo(text));
  }
  render () {
    return (
      <div>
        <h1>Todos List</h1>
        <AddTodo onClick={this._handleAddTodo}>Add todo</AddTodo>
        <TodosList/>
      </div>
    );
  }
}

export default connect() (TodoApp);
