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

const CURRENT_BUILD = "Buildv1.3-Heroku";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState([]);           //A boolean value whether the user is logged in or not.
  const [isRegistered, setIsRegistered] = useState(false);       //A boolean value whether the user has registered or not.

  const [players, setPlayers] = useState([]);

  const [login, setLogin] = useState({ name: "login" });

  const [hasDownloaded, setHasDownloaded] = useState(false);

  useEffect(() => {

    console.log("-".repeat(60));
    console.log("PROMPT : We are not logged in.  We should check if the user is logged in.");

    AUTHO_checkUser();
    checkIfDownloaded();
  }, []);

  return (

    <Router>

      <NavTabs isLoggedIn={isLoggedIn ? true : false} />
      <Route exact path="/login" render={(props) => <Login {...props} isRegistered={isRegistered ? true : false} signIn={AUTHO_signIn} handleInputChange={handleLoginInputChange} />} />
      <Route exact path="/home" render={(props) => <Home {...props} signOut={AUTHO_signOut} />} />
      <Route exact path="/play" render={(props) => <Play {...props} handleDownload={handleDownload} handleDownloadLost={handleDownloadLost} hasDownloaded={hasDownloaded} build = {CURRENT_BUILD}/>} />
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

  function handleDownload(event){
    console.log("handling download");

    localStorage.setItem("hasDownloaded", true);

    if(hasDownloaded !== true){
      setHasDownloaded(true);
    }
  }

  function handleDownloadLost(event){
    console.log("Handling loss of download");

    localStorage.removeItem("hasDownloaded");

    if(hasDownloaded){
      setHasDownloaded(false);
    }
  }

  function checkIfDownloaded(){
    console.log("-".repeat(60));
    console.log("PROMPT : Checking if the user has downloaded the game ...");

    const localDownload = localStorage.getItem("hasDownloaded");

    //The user has downloaded the game before.
    if(localDownload){
      setHasDownloaded(true);

      console.log("RESULT : The user has downloaded the game");
      console.log("-".repeat(60));
    }
    else{
      if(hasDownloaded){
        setHasDownloaded(false);

        console.log("RESULT : The user has NOT downloaded the game");
        console.log("-".repeat(60));
      }
    }
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

          console.log("signing in");

          Auth.signIn(username, password)
            .then(user => {
              console.log("Successfully signed in");
              AUTHO_RegisterUser(username);
              setIsLoggedIn(true);
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
        AUTHO_RegisterUser(user.username);

        console.log("RESULT : User is logged in");
        console.log("-".repeat(60));

        //If our state is not already set to true, then...
        if (isLoggedIn !== true) {
          setIsLoggedIn(true);
          console.log("Changed isLoggedIn from false to true");
        }

        if (isRegistered !== true) {
          console.log("-".repeat(60));
          console.log("PROMPT : We are not registered.  We should check if the user is registered");

          checkIfRegistered();
          console.log("-".repeat(60));
        }
      })
      .catch(err => {
        //User is NOT logged in.
        console.log(err);

        console.log("RESULT : User is NOT logged in");
        console.log("-".repeat(60));

        //If our state is not already set to false, then...
        if (isLoggedIn !== false) {
          setIsLoggedIn(false);
          console.log("Changed isLoggedIn from true to false");
        }
        

        if (isRegistered !== true) {
          console.log("-".repeat(60));
          console.log("PROMPT : We are not registered.  We should check if the user is registered");

          checkIfRegistered();
          console.log("-".repeat(60));
        }
      })
  }

  function AUTHO_RegisterUser(username) {
    if (!isRegistered) {
      localStorage.setItem("registered", username);
      setIsRegistered(true);
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
      console.log(`RESULT : Found a login with the username of : ${localLogin}`);
      setIsRegistered(true);
    }
    else {
      console.log(`RESULT : Could not find registration stored in local storage`);
      setIsRegistered(false);
    }
  }
}

export default App;
