import React, { Component, PropTypes } from 'react';

export default class Todo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { todoText, completed } = this.props;
    return (
      <li onClick={this.props.onClick}  style={{
        textDecoration: completed ? 'line-through' : 'none'
      }}>
        {todoText}
      </li>
    );
  }
}
Todo.propTypes = {
  onClick: PropTypes.func,
  completed: PropTypes.bool,
  text: PropTypes.string
};
