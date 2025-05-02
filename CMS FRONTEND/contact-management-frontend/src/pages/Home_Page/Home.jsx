import React from 'react';
import Navhome from '../../components/Home/Navhome';
import Hero from '../../components/Home/Hero';

import Feature from '../../components/Home/Feature';
import Contactus from '../../components/Home/Contactus';

const Home = () => {
  return (
    <div>
      <Navhome />
      <section id="hero">
        <Hero />
      </section>
    
      <section id="feature">
        <Feature />
      </section>
      <section id="contactus">
        <Contactus />
      </section>
    </div>
  );
};

export default Home;
