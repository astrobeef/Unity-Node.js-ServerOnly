import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Play from "./components/pages/Play";
import Data from "./components/pages/Data";
import About from "./components/pages/About";

import API from "./utils/API";
import NavTabs from './components/NavTabs';
// import { ConnectionBase } from 'mongoose';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState([]);

  const [players, setPlayers] = useState([]);

  const [login, setLogin] = useState([]);

  useEffect(() => {
    setLogin({
      name: "login"
    });

    setIsLoggedIn(checkIfLoggedIn());
  }, []);



  return (

    <Router>
      <NavTabs />
      <Route exact path="/">
        {/* Redirect to login if the user is not logged in.  Else, redirect home */}
        {<Redirect to="/login" />}
      </Route>

      <Route exact path="/login">
        {isLoggedIn ? <Redirect to="/home" /> : <Redirect to="/login"></Redirect>}

      </Route>

      <Route exact path="/login" render={(props) => <Login {...props} handleInputChange={handleLoginInputChange} handleSubmit={handleLoginSubmit} />} />
      <Route exact path="/home" render={(props) => <Home {...props} />} />
      <Route exact path="/play" render={(props) => <Play {...props} />} />
      <Route exact path="/data" render={(props) => <Data {...props} players={players} displayPlayers={displayPlayers} DB_getPlayers={DB_getPlayers} />} />
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
  function checkIfLoggedIn() {
    const retrievedStorage = sessionStorage.getItem("login");
    console.log("Getting session login..." + retrievedStorage);

    //If we find data with the name 'login', then the user is logged in.
    if (retrievedStorage) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Updates the state of the login based on the input name and value
   * @param {Object} event - If an object, the change event fired when the input value is changed.
   * @param {String} event - If a string, the value to be set to the email.
   */
  function handleLoginInputChange(event) {

    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    setLogin({ ...login, [name]: value });

    console.log(login);
  }

  /**
   * This event handles login submits, sending the login information to the session storage.
   * @param {Object} event - The submit event fired.
   */
  function handleLoginSubmit(event) {
    event.preventDefault();

    if (checkAutho()) {
      console.log("storing to session storage...");
      console.log(login);

      const login_lessPassword = login;
      delete login_lessPassword["password"];
      delete login_lessPassword["password-confirm"];

      //We do not store the password, only the email.
      sessionStorage.setItem(login.name, JSON.stringify(login_lessPassword));
      localStorage.setItem(login.name, JSON.stringify(login_lessPassword));

      alert("You're logged in!");

      

    }
    else {
      console.log("User not authorized...");
      alert("You are not authorized");
    }

  }

  /**
   * @returns true if the user login is authorized.
   */
  function checkAutho() {
    return true;
  }
}

export default App;
