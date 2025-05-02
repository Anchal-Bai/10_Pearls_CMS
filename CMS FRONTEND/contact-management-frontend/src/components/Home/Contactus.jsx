import React, { useState, useEffect } from 'react';
import './Contactus.css'
// import Laptop from '../../assets/svg/Laptop.svg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {faPhone} from '@fortawesome/free-solid-svg-icons';
import {faFacebookF} from '@fortawesome/free-brands-svg-icons'
import {faInstagram} from '@fortawesome/free-brands-svg-icons'
import blobc from "../../assets/svg/blobs(green)/blob.svg";
import blobc1 from "../../assets/svg/blobs(green)/blob1.svg";
import blobc2 from "../../assets/svg/blobs(green)/blob2.svg";

import { motion } from 'framer-motion';
import { fadeIn } from '../../Variants';

const Contactus = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the element has already been viewed
    const hasViewed = localStorage.getItem('hasViewed');
    if (hasViewed) {
      setIsVisible(true); // Keep it visible if already viewed
    }
  }, []);

  const handleAnimationComplete = () => {
    // Mark the animation as completed and the content as visible
    localStorage.setItem('hasViewed', true);
    setIsVisible(true);
  };

  return (
    <div className='CU'>
      <div className="contentc">
      <motion.div
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            whileInView="show"
            onAnimationComplete={handleAnimationComplete}  // Triggered when animation completes
            viewport={{ once: true, amount: 0.7 }} // Trigger once when the element is in view
            className={`textc ${isVisible ? 'visible' : ''}`} // Apply visible class if already viewed
          >
        <h1>Get In Touch</h1>
        <p className='para'>Stay informed with our updates, follow us on social media, or contact us for collaborations. Let's build a sustainable future together.</p>
        <div className="socials">
  <div className="social-item">
    <div className="icon email"><FontAwesomeIcon icon={faEnvelope} /></div>
    <p>example@email.com</p>
  </div>
  <div className="social-item">
    <div className="icon facebook"><FontAwesomeIcon icon={faFacebookF} /></div>
    <p>Facebook Name</p>
  </div>
  <div className="social-item">
    <div className="icon instagram"><FontAwesomeIcon icon={faInstagram} /></div>
    <p>@instagram_handle</p>
  </div>
  <div className="social-item">
    <div className="icon phone"><FontAwesomeIcon icon={faPhone} /></div>
    <p>+123-456-7890</p>
  </div>
</div>
        </motion.div>
        
      </div>
      <motion.div
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            whileInView="show"
            onAnimationComplete={handleAnimationComplete}  // Triggered when animation completes
            viewport={{ once: true, amount: 0.7 }} // Trigger once when the element is in view
            className={`svgs ${isVisible ? 'visible' : ''}`} // Apply visible class if already viewed
          >
        {/* <object className="object">
            <embed src={Lap} className='lap'></embed>
          </object> */}
      </motion.div>

      <div className="bloballc">
          <object className="objectc">
            <embed src={blobc} className="blobc"></embed>
            <embed src={blobc1} className="blobc1"></embed>
            <embed src={blobc2} className="blobc2"></embed>
            
          </object>
        </div>
    </div>
  )
}

export default Contactus
