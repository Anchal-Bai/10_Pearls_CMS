import React, { useState, useEffect } from 'react';
import './Navhome.css';
import { Link } from 'react-router-dom';


function Navhome() {
  const [activeSection, setActiveSection] = useState('hero');
  const [navbarSolid, setNavbarSolid] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'feature', 'contactus'];
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      });

      if (window.scrollY >= 100) {
        setNavbarSolid(true);
      } else {
        setNavbarSolid(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navhome ${navbarSolid ? 'active' : ''}`}>
      <p>CMS_10Pearls</p>
      <ul id="navbar">
        <li>
          <Link to="#hero" className={activeSection === 'hero' ? 'active' : ''}>
            Home
          </Link>
        </li>
       
        <li>
          <Link to="#feature" className={activeSection === 'feature' ? 'active' : ''}>
            Introduction
          </Link>
        </li>
        <li>
          <Link to="#contactus" className={activeSection === 'contactus' ? 'active' : ''}>
            Contact Us
          </Link>
        </li>
        <li>
          <button className="signup-button" onClick={() => (window.location.href = '/register')}>
            Sign Up
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navhome;
