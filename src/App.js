import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Pong from './pages/Pong';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Switch>
          <Route exact path='/' component={Pong} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
