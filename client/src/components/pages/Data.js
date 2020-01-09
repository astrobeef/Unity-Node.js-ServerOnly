import React, {useEffect} from "react";
import { Link } from "react-router-dom";

//Components
import displayPlayers from "../displayPlayers";

function Data(props) {

  useEffect(() => {
    props.DB_getPlayers();
  }, []);

  return (
    <div className="App">
      <header className="App-header">

        <h1>Data</h1>
        <h3>Connected Players</h3>

        {props.players ? displayPlayers(props) : <p>No players connected</p>}

        <button type="button"   className="btn btn-primary">
          <Link to="/home" className={window.location.pathname === "/home" ? "nav-link active" : "nav-link"}>
            Home
        </Link>
        </button>

      </header>

    </div>
  )
}

export default Data;