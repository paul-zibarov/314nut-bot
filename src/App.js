import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import MainPage from './Pages/MainPage/MainPage';
import BurnPage from './Pages/BurnPage/BurnPage';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h2>3.14nut INDEX</h2>
      </header>
      <Switch>
        <Route path="/" exact component={MainPage} />
        <Route path="/burn" exact component={BurnPage} />
        <Redirect to="/" />
      </Switch>
      {/* <MainPage />
        <BurnPage /> */}
    </div>
  );
}

export default App;
