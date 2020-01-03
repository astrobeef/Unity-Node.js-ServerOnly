import React, {useEffect} from "react";
import { Link } from "react-router-dom";

function Data(props) {

  useEffect(() => {
    console.log("data effect");
    props.DB_getPlayers();
  }, []);

  console.log(props);
  console.log("props");

  return (
    <div className="App">
      <header className="App-header">

        <h1>Data</h1>
        <h3>Connected Players</h3>

        {props.players[0] ? props.displayPlayers() : <p>No players connected</p>}

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