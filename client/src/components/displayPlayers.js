import React from "react";

/**
 * Displays our users state in an HTML div.
 * @param {Object} props - Props MUST contain a 'players' array to be used in this component.
 * @returns HTML rendered component.
 */
export default function displayPlayers(props) {

    const {players} = props;        //Pull players off of props.

    //Return the contents to be rendered.
    return (
        <div>
            {/* Map over each 'player' in the array 'players' */}
            {players.map((player) => {
                player.key = Math.random();		//Give the player a random key value.
                //Return a <DIV> for each 'player' within 'players'
                return (
                    <div>
                        <h3>{player.username}</h3>
                        <p>{player.connection_id}</p>
                    </div>
                )
            })}
        </div>)
}