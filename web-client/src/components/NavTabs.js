import React from "react";
import { Link } from "react-router-dom";

function NavTabs() {
    return (
        <ul className="nav nav-tabs">
            <li className="nav-item">
                <Link to="/home" className={window.location.pathname === "/home" ? "nav-link active" : "nav-link"}>
                    Home
        </Link>
            </li>
            <li className="nav-item">
                <Link to="/" className={window.location.pathname === "/" ? "nav-link active" : "nav-link"}>
                    Login/Register
        </Link>
            </li>
            <li className="nav-item">
                <Link to="/play" className={window.location.pathname === "/play" ? "nav-link active" : "nav-link"}>
                    Play/Download
        </Link>
            </li>
            <li className="nav-item">
                <Link to="/data" className={window.location.pathname === "/data" ? "nav-link active" : "nav-link"}>
                    View data
        </Link>
            </li>
            <li className="nav-item">
                <Link to="/about" className={window.location.pathname === "/about" ? "nav-link active" : "nav-link"}>
                    About
        </Link>
            </li>
        </ul>
    );
}

export default NavTabs;
