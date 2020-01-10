import React, {useEffect} from "react";

//Components
import displayPlayers from "../displayPlayers";

function Data(props) {

  useEffect(() => {
    props.DB_getPlayers();
    console.log("Using data effect"); 
  }, []);

  return (
    <div className="App">
      <header className="App-header light-yellow">

        <h1>Data</h1>
        <h3>Connected Players</h3>

        {props.players ? displayPlayers(props) : <p>No players connected</p>}

      </header>

    </div>
  )
}

export default Data;