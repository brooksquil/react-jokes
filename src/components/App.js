// Where all other components are imported and inserted for render

// import react component
import React, { Component } from 'react';
// import global styles
import './App.css';

// import components to render
import Header from './Header';
import Joke from './Joke';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header title="Make Me Laugh!" />
        <Joke />
      </div>
    );
  }
}

export default App;
