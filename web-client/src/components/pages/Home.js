import React from "react";
import { Link } from "react-router-dom";

function Home(props) {

    return (
        <div className="App">
            <header className="App-header">

                <h1>Home</h1>

                <button type="button"   className="btn btn-primary">
                    <Link to="/play" className={window.location.pathname === "/play" ? "nav-link active" : "nav-link"}>
                        Play/Download
                    </Link>
                </button>

                <button type="button" className="btn btn-primary">
                    <Link to="/data" className={window.location.pathname === "/data" ? "nav-link active" : "nav-link"}>
                        View Data
                    </Link></button>

                <button type="button" className="btn btn-primary">
                    <Link to="/about" className={window.location.pathname === "/about" ? "nav-link active" : "nav-link"}>
                        About me
                    </Link>
                    </button>



            </header>
        </div>
    )
}

export default Home;