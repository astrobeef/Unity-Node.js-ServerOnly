import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import API from "./utils/API";



function App() {

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    DB_getPlayers();
  }, []);

  function DB_getPlayers() {
    API.getPlayers()
      .then(db_players => {
        setPlayers(db_players);
      }
      )
      .catch(err => console.log(err));
  };

  return (
    <div className="App">
      <header className="App-header">

        <h1>Connected Players</h1>

        {players[0] ? displayPlayers() : <p>Ah!</p>}

      </header>
    </div>
  );

  function displayPlayers() {
    return (
      <div>
        {players.map((player) => {
          return (
            <div>
              <h3>{player.username}</h3>
              <p>{player.connection_id}</p>
            </div>
          )
        })}
      </div>)
  }

}

export default App;
