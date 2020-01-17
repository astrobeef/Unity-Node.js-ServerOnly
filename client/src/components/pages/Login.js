import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Login(props) {

  useEffect(() => {
  }, []);

  return (
    <div className="App">
      <header className={props.isLoggedIn ? "App-header" : "App-header bg-blue"}>

        {props.needsVerify ? <div>

          <h1>Enter Verification code from your email</h1>

          <input type="verification" className="form-control" id="verification" placeholder="Verification code" name="verification" onChange={props.handleInputChange}></input>

                <button type="submit" value="Submit" className="btn btn-primary mt-2 mr-3" onClick={props.handleVerify}><h2>Submit Code</h2></button>

                <button type="submit" value="Submit" className="btn btn-primary mt-2 ml-3" onClick={props.handleResendVerification}><h2>Submit Code</h2></button>
                

        </div>
        : 

          <div>
        {props.isLoggedIn ? <Link to="/about">About</Link> :
          props.isRegistered ?
            <div><h1 className="header-light"> Welcome back!</h1>
              <form>
                <div className="form-group">
                  <label htmlFor="username" className="header-light">Username</label>
                  <input type="username" className="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter username" name="username" onChange={props.handleInputChange}></input>
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="header-light">Password</label>
                  <input type="password" className="form-control" id="password" placeholder="Password" name="password" onChange={props.handleInputChange}></input>
                </div>
                <button type="submit" value="Submit" className="btn btn-primary" onClick={props.signIn}><h2>Sign in</h2></button>
              </form>
            </div>
            :
            <div><h1> Greetings Newcomer</h1>
              <form>
                <div className="form-group">
                  <label htmlFor="email" className="header-light">Email</label>
                  <input type="email" className="form-control" id="email" placeholder="Email" name="email" onChange={props.handleInputChange}></input>
                </div>
                <div className="form-group">
                  <label htmlFor="username" className="header-light">Username</label>
                  <input type="username" className="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter username" name="username" onChange={props.handleInputChange}></input>
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="header-light">Password</label>
                  <input type="password" className="form-control" id="password" placeholder="Password" name="password" onChange={props.handleInputChange}></input>
                </div>
              </form>
              <button type="submit" value="Submit" className="my-3 btn btn-primary" onClick={props.signUp}><h2>Sign up</h2></button>

              <h5 className="header-light"> Already have an accout?</h5>

              <button type="submit" value="Submit" className="btn btn-primary" onClick={props.handleHasRegistered}><h4>Sign in</h4></button>
            </div>

        }</div>
      }


      </header>

    </div>

  )
}


export default Login;