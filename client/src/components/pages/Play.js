import React from "react";
import { Link } from "react-router-dom";

function Play(props) {

  const hasDownloaded = checkHasDownloaded();

  return (
    <div className="App">
      <header className="App-header">

        <h1>Play/Download</h1>
        <h3>Check if the player has downloaded the game</h3>
        <h5>Can check Indexed-DB for this</h5>

        {hasDownloaded ?    //If the user has downloaded the game, then prompt them to play.
          <button type="button" className="btn btn-warning my-2">
            Play
      </button> :     //Else, prompt the user to download the game.
          <button onClick = {props.handleDownload} type="button" className="btn btn-warning my-2">
                <Link to="/assets/game-builds/buildv1.1.rar" className={window.location.pathname === "/assets/game-builds/buildv1.1.rar" ? "nav-link active" : "nav-link"}>Download</Link>
      </button>}

        <button type="button" className="btn btn-primary my-2">
          <Link to="/home" className={window.location.pathname === "/home" ? "nav-link active" : "nav-link"}>
            Home
        </Link>
        </button>

      </header>

    </div>
  )
}

/**
 * Checks if the user has downloaded the game.
 * @returns true if file exists in IndexedDB.  False if not.
 */
function checkHasDownloaded(){
  return false;
}

export default Play;