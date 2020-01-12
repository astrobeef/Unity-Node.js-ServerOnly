import React, { useEffect } from "react";

//Components
import displayPlayers from "../displayPlayers";

function Data(props) {

  useEffect(() => {
    props.DB_getPlayers();
    props.DB_getMessages();
  }, []);

  return (
    <div className="App">
      <header className="light-yellow">

        <h1 className = "mt-20 py-5">Data</h1>

        <div className="row justify-content-center">
          <div className="col-5">

            <h3>Connected Players</h3>

            {props.players ? displayPlayers(props) : <p>No players connected</p>}
          </div>
          <div className="col-5">

            <h3>Global Message Board</h3>
            <ul className="list-group text-left">
              {props.generateMessages()}
              <input id = "message-input" name = "message" className = "list-group-item my-1" type = "text" placeholder = "Type a message..." onChange = {props.handleInputChange} value = {props.message}></input>
              <button className = "list-group-item col-3" onClick={props.handleSendMessage}>Send message</button>
            </ul>

          </div>
        </div>

      </header>

    </div>
  )
}

export default Data;