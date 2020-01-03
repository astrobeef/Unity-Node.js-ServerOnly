import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Play from "./components/pages/Play";
import Data from "./components/pages/Data";
import About from "./components/pages/About";

import API from "./utils/API";
import NavTabs from './components/NavTabs';

function App() {

  const isLoggedIn = checkIfLoggedIn();

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // DB_getPlayers();
  }, []);



  return (

    <Router>
      <NavTabs />
      <Route exact path="/">
        {/* Redirect to login if the user is not logged in.  Else, redirect home */}
        {isLoggedIn ? <Redirect to="/home"/> : <Redirect to="/login"/>}
      </Route>
      <Route exact path="/login" render={(props) => <Login {...props} />} />
      <Route exact path="/home" render={(props) => <Home {...props} />} />
      <Route exact path="/play" render={(props) => <Play {...props} />} />
      <Route exact path="/data" render={(props) => <Data {...props} players={players} displayPlayers={displayPlayers} DB_getPlayers={DB_getPlayers}/>} />
      <Route exact path="/about" render={(props) => <About {...props} />} />
    </Router>

  );


  function DB_getPlayers() {
    API.getPlayers()
      .then(db_players => {
        setPlayers(db_players);
      }
      )
      .catch(err => {
        console.log(err)
      });
  };

  function displayPlayers() {
    return (
      <div>
        {players.map((player) => {
          player.key = Math.random();
          return (
            <div>
              <h3>{player.username}</h3>
              <p>{player.connection_id}</p>
            </div>
          )
        })}
      </div>)
  }

  /**
   * Checks if the user is logged in
   * @returns true if the user is logged in, false if not.
   */
  function checkIfLoggedIn(){
    return false;
  }

}

export default App;
