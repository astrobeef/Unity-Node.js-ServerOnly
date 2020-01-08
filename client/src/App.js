import React, { useState, useEffect } from 'react';
import { Auth } from "aws-amplify";

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

  const [isLoggedIn, setIsLoggedIn] = useState([]);           //A boolean value whether the user is logged in or not.
  const [isRegistered, setIsRegistered] = useState([]);       //A boolean value whether the user has registered or not.

  const [players, setPlayers] = useState([]);

  const [login, setLogin] = useState([]);

  useEffect(() => {
    if (!isRegistered) setIsRegistered(checkIfRegistered());

    setLogin({
      name: "login"
    });

    AUTHO_checkUser();
  }, []);



  return (

    <Router>

      <NavTabs isLoggedIn={isLoggedIn ? true : false} />
      <Route exact path="/login" render={(props) => <Login {...props} isRegistered={isRegistered ? true : false} signIn={AUTHO_signIn} handleInputChange={handleLoginInputChange} />} />
      <Route exact path="/home" render={(props) => <Home {...props} signOut={AUTHO_signOut} />} />
      <Route exact path="/play" render={(props) => <Play {...props} />} />
      <Route exact path="/data" render={(props) => <Data {...props} players={players} displayPlayers={displayPlayers} DB_getPlayers={DB_getPlayers} />} />
      <Route exact path="/about" render={(props) => <About {...props} />} />
      <Route path="*" render={(props) => isLoggedIn ? <Redirect to="/home"></Redirect> : <Redirect to="/login"></Redirect>} />
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

  //AWS Autho

  function AUTHO_signIn(event) {
    event.preventDefault();

    if (isRegistered) {
      console.log(login);

      if (login) {
        if (login.username) {
          const username = login.username;
          const password = login.password;

          Auth.signIn(username, password)
            .then(user => {
              AUTHO_ValidateUser(username);
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    }
    else {
      Auth.federatedSignIn();
    }
  }

  function AUTHO_signOut() {
    Auth.signOut()
      .then(data => {
        console.log("successfully signed out");

        //Remove our login registration from the session storage.
        localStorage.removeItem("registered");
        setIsLoggedIn(false);
      })
      .catch(err => console.log(err))
  }

  /**
   * This runs with App.js
   * Checks if there is a user logged in.  If yes, then register the user to the local storage.
   */
  function AUTHO_checkUser() {
    Auth.currentAuthenticatedUser()
      .then(user => {
        //User IS logged in.
        AUTHO_ValidateUser(user.username);
      })
      .catch(err => {
        setIsLoggedIn(false);
        //User is NOT logged in.
        console.warn(err);
        setIsLoggedIn(false);
      })
  }

  function AUTHO_ValidateUser(username) {
    setIsLoggedIn(true);

    if (!isRegistered) {
      setIsRegistered(true);

      localStorage.setItem("registered", username);
    }
  }

  /**
   * Checks if the user is logged in by checking the local storage.
   * @returns true if the user is logged in, false if not.
   */
  function checkIfRegistered() {
    console.log("checking for registered user...");

    const localLogin = localStorage.getItem("registered");

    if (localLogin) {
      console.log(`Found a login with the username of : ${localLogin}`);
      return true;
    }
    else {
      console.log(`Could not find login stored in local storage`);
      return false;
    }
  }
}

export default App;
