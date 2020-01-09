import React from "react";
import { Link } from "react-router-dom";

function Play(props) {

  const hasDownloaded = checkHasDownloaded();

  return (
    <div className="App">
      <header className="App-header">

        <h1>Download Instructions</h1>
        <h5>If you don't have software to open ZIP files, follow the WinRAR link below.</h5>
        <h5>Once you've downloaded the ZIP file, open the file and run the 'launch.exe' file to play.</h5>

        <h4 className = "mt-4">WinRAR 'trial' download</h4>
        <a href = "https://www.rarlab.com/rar/winrar-x64-580.exe"> Windows </a>
        <a href = "https://www.rarlab.com/rar/rarosx-5.8.0.tar.gz"> Mac </a>

        <h4 className = "mt-5 mb-2">Download my Game!</h4>
        {hasDownloaded ?    //If the user has downloaded the game, then prompt them to play.
          <button type="button" className="btn btn-warning my-2">
            Play
      </button> :     //Else, prompt the user to download the game.
          <button onClick = {props.handleDownload} type="button" className="btn btn-warning my-2">                
                <Link to="/assets/game-builds/Buildv1.3-L.zip" target="_blank" download>Download</Link>
      </button>}

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