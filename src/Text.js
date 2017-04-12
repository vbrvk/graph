import React, { Component, PropTypes } from 'react';
import parse from './parse';

const KEY_CODES = {
  TAB: 9,
};

export default class Text extends Component {
  static propTypes = {
    setTree: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }


  onChange() {
    const text = this.area.value;
    try {
      const tree = parse(text, ' ');
      this.props.setTree(tree);
    } catch (err) {
      this.props.setError(err);
    }
  }

  onKeyDown(e) {
    if (e.keyCode === KEY_CODES.TAB) {
      e.preventDefault();
      let text = this.area.value;
      const cursorPos = this.area.selectionStart;
      text = `${text.slice(0, cursorPos)}\t${text.slice(cursorPos + 1)}`;
      this.area.value = text;
      this.onChange();
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
