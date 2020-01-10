import React from "react";
import { Link } from "react-router-dom";

function Home(props) {

    return (
        <div className="App">
            <header className="App-header">

                    <button type="button" className="btn btn-primary" onClick={props.signOut}>
                        <h2 className = "m-2">Sign Out</h2>
                    </button>

            </header>
        </div>
    )
}

export default Home;