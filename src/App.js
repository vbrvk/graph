import React, { Component } from 'react';
import Text from './Text';
import Error from './Error';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.setTree = this.setTree.bind(this);
    this.setError = this.setError.bind(this);
  }

  state = {
    tree: {},
    error: false,
  }

  setTree(tree) {
    this.setState({
      tree,
      error: null,
    });
  }

  setError(err) {
    this.setState({
      error: err.message,
    });
  }

  render() {
    return (
      <div className="App" >
        <Text className="input-text" setTree={this.setTree} setError={this.setError} />
        <p className="output">{JSON.stringify(this.state.tree)}</p>
        <Error isActive={this.state.error} text={this.state.error} />
      </div>
    );
  }
}

export default App;
