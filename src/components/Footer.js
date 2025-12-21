import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/global.css';

const Footer = () =>{
    const currentYear= new Date().getFullYear();
    return(
        <footer>
            <div className="container">
                <p>&copy: {currentYear} Amir. All rights reserved.</p>
                <div className="footer-links">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        View Portfolio Source Code
                    </a>
                    <Link to="/contact"> Contact Info</Link>
                </div>
                <p className="built-with">
                    Built with **React** and **CSS**.
                </p>

            </div>
            
        </footer>
    );
};

export default Footer;