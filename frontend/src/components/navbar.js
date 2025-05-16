// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={styles.navbar}>
            <div style={styles.navBrand}>
                <Link to="/" style={styles.navLinkBrand}>Blockchain MFA</Link>
            </div>
            <ul style={styles.navbarNav}>
                <li style={styles.navItem}>
                    <Link to="/" style={styles.navLink}>Home</Link>
                </li>
                <li style={styles.navItem}>
                    <Link to="/settings" style={styles.navLink}>Settings</Link>
                </li>
            </ul>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: '#333',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        position: 'fixed', // Make it fixed at the top
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 1000, // Ensure it stays on top of other content
    },
    navBrand: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    navLinkBrand: {
        color: '#fff',
        textDecoration: 'none',
        // No specific hover style for brand, it's just text
    },
    navbarNav: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
    },
    navItem: {
        marginLeft: '20px',
    },
    navLink: {
        color: '#fff',
        textDecoration: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        transition: 'background-color 0.3s ease',
    },
    // No direct hover styles in inline objects, typically handled by CSS
    // For example, in a CSS file:
    // .navLink:hover {
    //     background-color: #555;
    // }
};

export default Navbar;