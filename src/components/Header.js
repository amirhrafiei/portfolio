import React from 'react';
import {Link} from 'react-router-dom';
// import '../styles/global.css';

const Header = () =>{
    return (
        <header>
            <div className="container nav-content">
                <h1>
                    <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                        Amir
                    </Link>
                </h1>
                <nav>
                    <Link to="/">Projects</Link>
                    <a href="#skills">Skills</a>
                    <a href="mailto:email@example.com">Contact</a>
                </nav>
            </div>
        </header>
    );






};

export default Header;