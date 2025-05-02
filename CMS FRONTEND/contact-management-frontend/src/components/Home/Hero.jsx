import React from 'react';
import './Hero.css';
import svg from '../../assets/svg/Heromaking.svg';

const Hero = () => {
  return (
    <div className='hero'>
      <div className='Content'>
        <h1>Contact Hub!</h1>
        <h2>Simplify Contacts. Strengthen Connections.</h2>
        <h3>Manage Your Contacts with Ease and Clarity</h3>
      </div>
      <div className="illustration" id="ill">
        <object className="object">
          <embed src={svg} />
        </object>
      </div>
    </div>
  );
};

export default Hero;
