import React from "react";
import { Link } from "react-router-dom";

function About(props) {

  return (
    <div className="App">
      <header className="App-header">

        <h1>About Me</h1>
        <h3>I'm Brian Graf</h3>
      <button type="button"   className="btn btn-primary">
        <Link to="/home" className={window.location.pathname === "/home" ? "nav-link active" : "nav-link"}>
          Home
        </Link>
      </button>

      </header>


    </div>
  )
}

export default About;