import React, { useState, useEffect } from 'react';
import "./Feature.css";
import blob from "../../assets/svg/blobs(blue)/blob.svg";
import blob1 from "../../assets/svg/blobs(blue)/blob1.svg";
import blob2 from "../../assets/svg/blobs(blue)/blob2.svg";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { faVideo } from '@fortawesome/free-solid-svg-icons'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import {faGamepad} from '@fortawesome/free-solid-svg-icons'

import { motion } from 'framer-motion';
import { fadeIn } from '../../Variants';




const Feature = () => {
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
    <div className="F">
      <div className="contentf">
      <motion.div
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            whileInView="show"
            onAnimationComplete={handleAnimationComplete}  // Triggered when animation completes
            viewport={{ once: true, amount: 0.7 }} // Trigger once when the element is in view
            className={`textf ${isVisible ? 'visible' : ''}`} // Apply visible class if already viewed
          >
          <h1>About Us!</h1>
<div className="about-description">
  <p>
    At Contact Management System (CMS), we believe that organized communication is the cornerstone of productivity. Our mission is to simplify the way individuals and businesses manage their contacts by providing a clean, secure, and intuitive platform. Whether you're tracking personal connections or managing professional relationships, CMS empowers you to stay connected, informed, and in control.
  </p>

  <p>
    Built with modern technologies, our system offers secure login, personalized dashboards, seamless CRUD operations, and responsive design — making contact management effortless across devices. As a team of passionate developers, we’re committed to delivering a reliable solution that helps you focus on what truly matters: your relationships.
  </p>

  <p>
    Let us handle the complexity, so you can manage your contacts with clarity and confidence.
  </p>
</div>

        </motion.div>
        </div>
       
        <div className="bloball">
          <object className="object">
            <embed src={blob} className="blob"></embed>
            <embed src={blob1} className="blob1"></embed>
            <embed src={blob2} className="blob2"></embed>
            <embed src={blob1} className="blob3"></embed>
          </object>
        </div>
    </div>
  );
};

export default Feature;
