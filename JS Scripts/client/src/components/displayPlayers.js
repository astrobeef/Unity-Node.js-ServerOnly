import React from "react";

/**
 * Displays our users state in an HTML div.
 * @param {Object} props - Props MUST contain a 'players' array to be used in this component.
 * @returns HTML rendered component.
 */
export default function displayPlayers(props) {

    const {players} = props;        //Pull players off of props.

    let displayedAPlayer = false;

    //Return the contents to be rendered.
    return (
        <div>
            {/* Map over each 'player' in the array 'players' */}
            {players.map((player) => {
                player.key = Math.random();		//Give the player a random key value.
                //Return a <DIV> for each 'player' within 'players'
                return (
                    <div>
                        {player.username === "Default_Player" ? null : <h3>{player.username}{displayedAPlayer = true}</h3>}
                        <br></br>
                    </div>
                )
            })}

            {displayedAPlayer ? null : <span>There are no players connected to any game lobbies</span>}
        </div>)
}