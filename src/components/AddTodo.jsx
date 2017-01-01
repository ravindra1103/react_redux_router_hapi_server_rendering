import React, { Component, PropTypes } from 'react';

export default class AddTodo extends Component {
  constructor(props) {
    super(props);
    this._onChangeTextHandle = this._onChangeTextHandle.bind(this);
    this._onHandleAdd = this._onHandleAdd.bind(this);
    this.state = {
      todoText: ''
    };
  }
  _onChangeTextHandle(event) {
    this.setState({
      todoText: event.target.value
    });
  }
  _onHandleAdd() {
    this.props.onClick(this.state.todoText);
    this.setState({
      todoText: ''
    });
  }
  render() {
    return(
    <div>
      <input type="text" onChange={this._onChangeTextHandle} value={this.state.todoText}/>
      <button onClick={this._onHandleAdd}>Add todo</button>
    </div>
    );
  }
}

AddTodo.propTypes = {
  onClick : PropTypes.func
};
