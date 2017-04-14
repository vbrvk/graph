import React, { Component } from 'react';
import Text from './Text';
import Error from './Error';
import Graph from './Graph';
import parse, { getGraphData } from './parse';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.setText = this.setTree.bind(this);
  }

  state = {
    tree: {
      nodes: [],
      links: [],
    },
    error: false,
  }

  setTree(text) {
    try {
      const tree = getGraphData(parse(text, '\t'));
      // console.log(JSON.stringify(tree));
      this.setState({
        tree,
        error: null,
      });
    } catch (e) {
      this.setState({
        error: e.message,
      });
    }
  }

  render() {
    return (
      <div className="App" >
        <Text className="input-text" setText={this.setText} />
        <Graph className="output" graphData={this.state.tree} />
        <Error isActive={this.state.error} text={this.state.error} />
      </div>
    );
  }
}

export default App;
