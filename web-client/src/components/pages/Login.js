import React from "react";

function Login(props) {

  const isRegistered = checkIfRegistered();      //A boolean value whether the user has registered or not.

  console.log(props);
  console.log("props");

  return (
    <div className="App">
      <header className="App-header">

        <h1>Login</h1>
        <h3>Is the player registered already?</h3>
        <h3>Login data should be cached in the browser</h3>
        <h5>For this I can use a service worker... I'll need to review that</h5>

        {isRegistered ? 
        <div>
          <h1>Username</h1>
          <input></input>
          <h1>Password</h1>
          <input></input>
        </div>
        :
        <div>
            <h1>Email</h1>
            <input></input>
          <h1>Username</h1>
          <input></input>
          <h1>Password</h1>
          <input type = "password"></input>
          <h1>Repeat Password</h1>
          <input type = "password"></input>
        </div>
      }

      </header>

    </div>

  )
}

/**
 * Checks if the user is logged in by checking the local storage.
 * @returns true if the user is logged in, false if not.
 */
function checkIfRegistered() {
  return false;
}

export default Login;