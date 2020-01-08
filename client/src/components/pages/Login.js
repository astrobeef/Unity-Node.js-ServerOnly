import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";

function Login(props) {

  useEffect(() => {
  }, []);

  return (
    <div className="App">
      <header className="App-header">

        {props.isRegistered ? 
        <div><h1> Welcome back!</h1>
          <form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="username" className="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter username" name="username" onChange={props.handleInputChange}></input>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" placeholder="Password" name="password" onChange={props.handleInputChange}></input>
            </div>
            <button type="submit" value="Submit" onClick={props.signIn}>Sign in</button>
          </form>
        </div>
          : 
          <div><h1> Greetings Newcomer</h1>
              <button type="submit" value="Submit" onClick={props.signIn}>Sign up</button>
              Refresh the page once you've signed up.  This is a bug I haven't fixed yet.
          </div>}



      </header>

    </div>

  )
}


export default Login;