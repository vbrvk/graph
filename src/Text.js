import React, { Component } from 'react';
import PropTypes from 'prop-types';

const KEY_CODES = {
  TAB: 9,
};

export default class Text extends Component {
  static propTypes = {
    setText: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }


  onChange() {
    this.props.setText(this.area.value);
  }

  onKeyDown(e) {
    if (e.keyCode === KEY_CODES.TAB) {
      let text = this.area.value;
      const cursorPos = this.area.selectionStart;
      let nextCursorPos;
      if (e.shiftKey && text[cursorPos - 1] === '\t') {
        text = `${text.slice(0, cursorPos - 1)}${text.slice(cursorPos)}`;
        nextCursorPos = cursorPos - 1;
      } else {
        text = `${text.slice(0, cursorPos)}\t${text.slice(cursorPos)}`;
        nextCursorPos = cursorPos + 1;
      }

      this.area.value = text;
      this.area.selectionStart = nextCursorPos;
      this.area.selectionEnd = nextCursorPos;
      this.onChange();
      e.preventDefault();
    }
  }

  render() {
    return (
      <textarea
        className={this.props.className}
        ref={(input) => { this.area = input; }}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
      />);
  }
}
