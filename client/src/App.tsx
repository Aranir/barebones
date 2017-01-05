import * as React from 'react';
import './App.css';
import Test from "./Test";

export declare function require<T>(a: string): any


const logo = require<string>('./logo.svg');


class App extends React.Component<null, null> {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React-typescript</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
          <div className="App-body">
          <Test />
          </div>
      </div>
    );
  }
}

export default App;
