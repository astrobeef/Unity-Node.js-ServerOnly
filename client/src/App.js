/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * App.js - This script establishes our React client, setting up the routes for our web page.  It also houses many methods which are intergral to our application : handler methods, check methods, and authentication methods (using AWS Amplify).
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*-------------------*/
/*----NPM Imports----*/
/*-------------------*/

import React, { useState, useEffect } from 'react';         //React Import
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Auth } from "aws-amplify";							//AWS Amplify Authentication import
// import socketIOClient from "socket.io-client";

/*-------------------*/
/*---Local Imports---*/
/*-------------------*/

import './App.css';

//Pages
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Play from "./components/pages/Play";
import Data from "./components/pages/Data";
import About from "./components/pages/About";

//Components
import NavTabs from './components/NavTabs';

//Utils
import API from "./utils/API";


/*-------------------*/
/*--Local Variables--*/
/*-------------------*/

const CURRENT_BUILD = "Buildv1.7-H";		//The name of our current game build, found in /public/assets/game-builds/

/*-------------------*/
/*------- App -------*/
/*-------------------*/

function App() {

  //---State

  const [isLoggedIn, setIsLoggedIn] = useState([]);				//A boolean value whether the user is logged in or not.
  const [isRegistered, setIsRegistered] = useState(false);      	//A boolean value whether the user has registered or not.

  const [players, setPlayers] = useState([]);						//The players connected to the server

  const [loginInfo, setLoginInfo] = useState({ name: "login", message : "" });	//The user's login information: username, password.

  const [hasDownloaded, setHasDownloaded] = useState(false);		//A boolean value whether the user has downloaded the game or not.

  const [connection, setConnection] = useState({ active: false });

  const [messages, setMessages] = useState(null);

  //---Use Effect
  //-------Runs when state changes.
  useEffect(() => {
    AUTHO_checkUser();
    checkIfDownloaded();

    if (!connection.active) {
      setConnection({ ...connection, active: true });

      setInterval(() => {
        DB_getPlayers();
        DB_getMessages();
      }, 10000);
    }

  }, []);

  function setAccessToken(event) {

    event.persist();

    if (!connection.accessToken) {
      AUTHO_SetAccessToken(loginInfo.username, event);
    }
    else {
      console.log("Now that's efficency!");
      handleCopyAccessToken(event.target, connection.accessToken);
    }
  }

  //Return the render content for the web page.
  return (
    <div>
      <Router>

        <NavTabs isLoggedIn={isLoggedIn ? true : false} />
        <Route exact path="/login" render={(props) => <Login {...props} isRegistered={isRegistered ? true : false} signIn={AUTHO_signIn} signUp={AUTHO_signUp} handleInputChange={handleLoginInputChange} isLoggedIn={isLoggedIn} handleHasRegistered={handleHasRegistered} />} />
        <Route exact path="/home" render={(props) => <Home {...props} signOut={AUTHO_signOut} />} />
        <Route exact path="/play" render={(props) => <Play {...props} handleDownload={handleDownload} handleDownloadLost={handleDownloadLost} hasDownloaded={hasDownloaded} build={CURRENT_BUILD} setAccessToken={setAccessToken} displaySuccess={connection.displaySuccess} />} />
        <Route exact path="/data" render={(props) => <Data {...props} players={players} DB_getPlayers={DB_getPlayers} generateMessages={generateMessages} DB_getMessages={DB_getMessages} handleInputChange={handleLoginInputChange} message = {loginInfo.message} handleSendMessage = {handleSendMessage}/>} />
        <Route exact path="/about" render={(props) => <About {...props} />} />

        <Route path="/*" render={(props) => { if (!isLoggedIn) return (<Redirect to="/login"></Redirect>) }} />
      </Router>
    </div>

  );

  function generateMessages() {
    if(messages && messages[0].message.trim().length > 1){
      return messages.map(message => <li key={Math.random()} className="list-group-item"><b>{message.username} : </b>{message.message}</li>);
    }
    else{
      return null;
    }
  }

  /*------------------------*/
  /*-- Database Functions --*/
  /*------------------------*/

	/**
	 * Returns the players from our Mongo Database.
	 */
  function DB_getPlayers() {
    API.getPlayers()	//Call the getPlayers() method off of our API object, which was imported from Utils.
      .then((db_players) => {		//Then, with the retrieved data, ...
        setPlayers(db_players);		//Set our players state to the retrieved data.
      }
      )
      .catch((err) => {
        console.error(err);
      });
  };

  /**
   * Registers the user into our Mongo Database.
   * @param {string} username - The user to be added to the database.
   */
  function DB_registerUser(username) {

    /*Check if the user is already registered*/ const DB_isRegistered = false; // For now, we assume no.

    const payload = { username };

    //CHECK IF USER IS REGISTERED

    DB_getUser(username).then((DB_User) => {

      if (!DB_User) {
        //If we did not find the user, then create a reference.
        API.createUser(payload)
          .then((db_User) => {
          })
          .catch((err) => {
            console.error(err);
          });
      }
      else {
        //Do nothing; user is already registered in MongoDB.
      }

    }).catch((err) => {

      console.log(err);
    });

  };

  /**
   * Updates the access token of the user.
   * @param {String} username - The user to be updated in the MongoDB.
   * @param {Object} payload - The information to be changed.  Must match keys in the User Model.
   */
  function DB_updateUser(username, payload) {

    API.updateUser(username, payload)
      .then((db_User) => {
      })
      .catch((err) => {
        console.log(err);
      });

  }

  /**
   * Finds the user.  Returns true if the user is found, false if not.
   * @param {string} username - The user to be found in the MongoDB.
   */
  function DB_getUser(username) {

    return new Promise(function (resolve, reject) {

      API.getUser(username)
        .then((db_User) => {

          if (db_User.length > 0) {
            resolve(JSON.stringify(db_User));
          }
          else {
            resolve(null);
          }

        }).catch((err) => {
          console.error(err);
          reject(err);
        });
    })
  }

  function DB_getMessages() {
    return new Promise(function (resolve, reject) {

      API.getMessages()
        .then((db_Messages) => {
          if (db_Messages && db_Messages.length > 0) {
            if(db_Messages.length > 5){
              console.log("Too many messages in MongoDB to display them all");
              setMessages(db_Messages.slice(db_Messages.length - 5, db_Messages.length));
            }
            else{
              setMessages(db_Messages);
            }
          }

          resolve(db_Messages);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });

    })
  };

  function DB_createMessage(username) {

  };

  /*-----------------------*/
  /*-- Handler Functions --*/
  /*-----------------------*/

  /** Handle Login Input Change
   * Updates the state of the login based on the input name and value
   * @param {Object} event - If an object, the change event fired when the input value is changed.
   * @param {String} event - If a string, the value to be set to the email.
   */
  function handleLoginInputChange(event) {

    const { target } = event;		//Pull the target off of our event.
    const value = target.value;		//Set a reference for our target's value (the user's input).
    const { name } = target;		//Pull the name off of our target (the element to be changed by the input).

    setLoginInfo({ ...loginInfo, [name]: value });		//Set the key of 'name' to the value of 'value', so the user's input alters their login info.
  }

  /** Handle Download
   * This does not download the game, but instead sets a reference within the local storage that we have downloaded the game.
   * @param {Object} event - The fired event from the action.
   */
  function handleDownload(event) {

    localStorage.setItem("hasDownloaded", true);		//Set an item in localStorage so we can reference it later to check if the user has downloaded the game.

    //If 'hasDownloaded' is not already true, then set it to true.
    if (hasDownloaded !== true) {
      setHasDownloaded(true);		//Alter the state of 'hasDownloaded' to true
    }
  }

  /** Handle Download Lost
   * This is fired if the user needs to download the game again.  The local storage 'hasDownloaded' item is removed.
   * @param {Object} event - The fired event from the action.
   */
  function handleDownloadLost(event) {

    localStorage.removeItem("hasDownloaded");		//Remove the item 'hasDownloaded' so we can reference it later to check that the user has NOT downloaded the game.

    //If 'hasDownloaded' is not already false, then set it to false.
    if (hasDownloaded !== false) {
      setHasDownloaded(false);		//Alter the state of 'hasDownloaded to false.
    }
  }

  function handleCopyAccessToken(target, token) {
    if (target) {
      if (target.id !== "data-token" && target.id !== "download-btn") {
        console.log("We did not click on the button");

        handleCopyAccessToken(target.parentNode, token);
      }
      else {
        const atr = token;

        const dummyTextArea = document.createElement("textarea");

        dummyTextArea.value = atr;
        document.body.appendChild(dummyTextArea);
        dummyTextArea.select();

        document.execCommand('copy');
        document.body.removeChild(dummyTextArea);

        console.log("Copied to clipboard!");

        if (!connection.displaySuccess) {
          setConnection({ ...connection, "accessToken": atr, displaySuccess: true });

          setTimeout(() => {
            setConnection({ ...connection, "accessToken": atr, displaySuccess: false });
          }, 2000);
        }

      }
    }
  };

  /**
   * Runs if the user has already registerd but we did not recognize it
   */
  function handleHasRegistered() {
    setIsRegistered(true);
  }

  function handleSendMessage(event) {
    const inputMessage = {username : loginInfo.username, message : loginInfo.message};

    if(inputMessage.message.trim().length > 2){

      API.createMessage(inputMessage);
      setLoginInfo({...loginInfo, message : ""});
    }
    else{
      console.log("Message was too short.  Did not send");
    }
  }

  /*-----------------------*/
  /*--- Check Functions ---*/
  /*-----------------------*/

  /** Check If Downloaded
   * This function checks our local storage to see if the item 'hasDownloaded' exists.
   * Sets our state 'hasDownloaded' to the result of this check.
   */
  function checkIfDownloaded() {

    const localHasDownload = localStorage.getItem("hasDownloaded");		//Get, and set a reference to, the item 'hasDownloaded', if it exists.

    //If the item exists, then the player has downloaded the game before.
    if (localHasDownload) {
      setHasDownloaded(true);			//sets our state 'hasDownloaded' to true
    }
    else {
      //If 'hasDownloaded' is not already set to false, then set it to false.
      if (hasDownloaded !== false) {
        setHasDownloaded(false);		//Sets our state 'hasDownloaded' to false.
      }
    }
  }

  /** Check if Registered
   * Upon start up, checks if the user is logged in by checking the local storage.
   * @returns true if the user is logged in, false if not.
   */
  function checkIfRegistered() {

    const localLogin = localStorage.getItem("registered");		//Get, and set a reference to, item 'registered', if it exists.

    //If we got the item, then...
    if (localLogin) {
      setIsRegistered(true);		//Set is registered to true.
    }
    else {
      setIsRegistered(false);
    }
  }

  /*-----------------------*/
  /*------ AWS Autho ------*/
  /*-----------------------*/

  /**
   * Uses AWS Amplify to sign in a returning user.
   * @param {Object} event - The event fired with the action.
   */
  function AUTHO_signIn(event) {
    event.preventDefault();		//Prevent the default action of the event.

    //If we have login info, then...
    if (loginInfo /* Updated upon user input */) {
      //If we have a username and password, then...
      if (loginInfo.username && loginInfo.password) {
        const username = loginInfo.username;
        const password = loginInfo.password;

        //Use AWS Amplify to attempt to sign in our user.
        Auth.signIn(username, password)
          .then(user => {		//If successful, then...
            AUTHO_UponSuccessfulSignIn(username);
          })
          .catch(err => {		//If unsuccessful, then...
            console.log(err);
          });
      }
      else {
        console.warn("Missing username or password for login");
      }
    }
  }

  /**
   * Uses AWS Amplify to sign up a new user.
   * @param {Object} event - The event fired with the action.
   */
  function AUTHO_signUp(event) {

    if (loginInfo /* Updated upon user input */) {
      //If we have a username and password, then...
      if (loginInfo.username && loginInfo.password && loginInfo.email) {
        const username = loginInfo.username;
        const password = loginInfo.password;
        const email = loginInfo.email;

        DB_getUser(username).then((DB_User) => {

          if (!DB_User) {
            //Use AWS Amplify to attempt to sign up the user.
            Auth.signUp({
              username,
              password,
              attributes: {
                email
              }
            }).then((user) => {
              AUTHO_UponSuccessfulSignIn(username);
            })
              .catch((err) => {
                console.log(err);
                console.warn("Could not log in");
              });
          }
          else {
            alert("Username is taken");
          }
        }).catch((err) => {
          console.log(err);
        })
      }
      else {
        console.warn("We do not have a filled username, password, and/or, email");
      }
    }
  }

  /**
   * Runs several functions once the user has signed in
   * @param {String} username - The name of the user being signed in.
   */
  function AUTHO_UponSuccessfulSignIn(username) {

    AUTHO_RegisterUser(username);		//Register the user into the local storage and mongo DB.
    setIsLoggedIn(true);				//Set our state 'isLoggedIn' to true.
  }

  /**
   * Use AWS Amplify to sign out the user.  Change our state as well.
   */
  function AUTHO_signOut() {
    //Use the 'signOut' method off of AWS Amplify Authentication.
    Auth.signOut()
      .then(data => {		//If successful, then...
        setIsLoggedIn(false);		//Set our 'isLoggedIn' state to false.
      })
      //If unsucessful, then log error.
      .catch(err => console.log(err))
  }

  /**
   * Uses AWS Amplify to check if there is a user logged in.  If yes, then register the user to the local storage.
   */
  function AUTHO_checkUser() {

    //Use the method off of AWS Amplify Authentication
    Auth.currentAuthenticatedUser()
      .then(user => {
        //User IS logged in.

        AUTHO_SetAccessToken(user.username, {});
        setLoginInfo({ ...loginInfo, username: user.username });

        //If our state is not already set to true, then...
        if (isLoggedIn !== true) {
          setIsLoggedIn(true);		//Set state to true.
        }

        //If our 'isRegistered' state is not already set to true, then...
        if (isRegistered !== true) {
          AUTHO_RegisterUser(user.username);		//Register our user into our local storage.
        }
      })
      .catch(err => {
        //User is NOT logged in.
        console.log(err);

        //If our state is not already set to false, then...
        if (isLoggedIn !== false) {
          setIsLoggedIn(false);		//Set state to false.
        }

        //If our 'isRegistered' state is not already set to true, then...
        if (isRegistered !== true) {
          checkIfRegistered();		//Check if the user is registered.
        }
      })
  }

  function AUTHO_SetAccessToken(username, event) {

    Auth.currentSession().then((sessionData) => {

      const accessToken = sessionData.getAccessToken().getJwtToken();

      setConnection({ ...connection, "accessToken": accessToken });

      DB_updateUser(username, { accessToken });

      DB_registerUser(username);

      if (event.target) {
        handleCopyAccessToken(event.target, accessToken);
      }

    }).catch((err) => {
      console.error(err);

      console.error("Could not get current session data");
    })
  }

  /**
   * Sets a reference to the user in local storage and in our Database so we can know the user has registered.
   * @param {String} username - The username of the current user.
   */
  function AUTHO_RegisterUser(username) {
    localStorage.setItem("registered", username);		//Set an item 'registered' in our local storage so we may check it later.
    setIsRegistered(true);		//Set our state 'isRegistered' to true.


  }
}

export default App;
