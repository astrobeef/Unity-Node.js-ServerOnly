import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Login(props) {

  useEffect(() => {
  }, []);

  return (
    <div className="App">
      <header className={props.isLoggedIn ? "App-header" : "App-header bg-blue"}>

            <input placeholder = "Paste Verification Code"></input>

        }


      </header>

    </div>

  )
}


export default Login;