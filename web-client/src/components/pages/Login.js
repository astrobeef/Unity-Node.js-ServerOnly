import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Login(props) {

  const [isRegistered, setIsRegistered] = useState([]);      //A boolean value whether the user has registered or not.

  useEffect(() => {
    setIsRegistered(checkIfRegistered());
  }, []);

  return (
    <div className="App">
      <header className="App-header">

        <h1>Register</h1>
        {isRegistered ? <h4>Welcome back, please log in</h4> : <h4>You're not registered in our systems</h4>}

        {isRegistered ?
          <div>
            <form>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" name="email" onChange={props.handleInputChange}></input>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password" name="password" onChange={props.handleInputChange}></input>
              </div>

              <button type="submit" value="Submit" onClick={props.handleSubmit}>Submit</button>

            </form>
          </div>
          :
          <div>
            <form>


              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="username" className="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter username" name="username" onChange={props.handleInputChange}></input>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" name="email" onChange={props.handleInputChange}></input>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password" name="password" onChange={props.handleInputChange}></input>
              </div>

              <div className="form-group">
                <label htmlFor="password-confirm">Repeat Password</label>
                <input type="password" className="form-control" id="password-confirm" placeholder="Confirm Password" name="password-confirm" onChange={props.handleInputChange}></input>
              </div>

              <button type="submit" value="Submit" onClick={props.handleSubmit}><Link to="/home" className={window.location.pathname === "/home" ? "nav-link active" : "nav-link"}>Submit
        </Link></button>

            </form>
          </div>
        }

      </header>

    </div>

  )

  /**
   * Checks if the user is logged in by checking the local storage.
   * @returns true if the user is logged in, false if not.
   */
  function checkIfRegistered() {
    console.log("checking for registered user...");

    const localLogin = localStorage.getItem("login");

    if (localLogin) {
      const login_JSON = JSON.parse(localLogin);
      console.log(`Found a login with the email of : ${login_JSON.email}`);
      return true;
    }
    else {
      console.log(`Could not find login stored in local storage`);
      return false;
    }

  }

}


export default Login;