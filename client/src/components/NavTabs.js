import React from "react";
import { Link } from "react-router-dom";

function NavTabs(props) {

    console.log(props);

    if (!props.isLoggedIn) {
        return null;
    }

    return (
        <ul className="nav justify-content-center pt-2">
            {/* <li className="nav-item">
                <Link to="/home" className="nav-link">
                    <h3>Home</h3>
        </Link>
            </li> */}
            {props.isLoggedIn ? null :
                <li className="nav-item">
                    <Link to="/login" className="nav-link">
                        <h3>Login/Register</h3>
                    </Link>
                </li>
            }
            <li className="nav-item">
                <Link to="/play" className="nav-link">
                    <h3>Download</h3>
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/data" className="nav-link">
                    <h3>Data</h3>
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/about" className="nav-link">
                    <h3>About</h3>
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/home" className="nav-link">
                    <h3>Sign Out</h3>
                </Link>
            </li>
        </ul>

    );
}

export default NavTabs;
