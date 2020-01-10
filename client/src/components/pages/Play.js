import React from "react";
import { Link } from "react-router-dom";

function Play(props) {

  const buildString = "/assets/game-builds/" + props.build + ".zip";

  return (
    <div className="App">
      <header className="App-header">

        {props.hasDownloaded ?
          <div><h1>You've downloaded the game!</h1>
          <h5 className = "my-3">If you can't find the download in your downloads folder, press the button below</h5>

          <button onClick={props.handleDownloadLost} type="button" className="btn btn-warning my-4">
            Lost Download
              </button>
          </div>
            :
          <div><h1>Download Instructions</h1>
              <h5>If you don't have software to open ZIP files, follow the WinRAR link below.</h5>
              <h5>Once you've downloaded the ZIP file, open the file and run the 'launch.exe' file to play.</h5>

              <h4 className="mt-4">WinRAR 'trial' download</h4>
              <a className = "winRAR" href="https://www.rarlab.com/rar/winrar-x64-580.exe"> Windows </a>
              <a className = "winRAR" href="https://www.rarlab.com/rar/rarosx-5.8.0.tar.gz"> Mac </a>

              <h4 className="mt-5 mb-2">Download my Game!</h4>
              <button for="download-link" type="button" className="btn btn-primary m-3">
                <Link id="download-link" onClick={props.handleDownload}  to={buildString} target="_blank" download ><h3>Download</h3></Link>
              </button>
            </div>

        }

      </header>

    </div>
  )
}

export default Play;