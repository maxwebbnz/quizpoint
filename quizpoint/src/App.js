/*
 * Copyright (c) 2022 QuizPoint
 * All rights reserved.
 */
import logo from './logo.svg';
import './App.css';

let userName;

function loadData(){
  userName = 'max'
}
function App() {
  loadData()
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to {userName}.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
