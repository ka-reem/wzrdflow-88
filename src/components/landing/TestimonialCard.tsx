
import React from 'react';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  quote: string;
  author: string;
  title: string;
  delay?: number;
}

export const TestimonialCard = ({ quote, author, title, delay = 0 }: TestimonialCardProps) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        delay 
      } 
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
    >
      <div className="glass-card p-6 rounded-xl shadow-lg flex flex-col h-full">
        <div className="mb-4 text-yellow-300">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.92 2L10 4C8.8 4.42 7.75 5.14 6.86 6.16C5.97 7.18 5.28 8.45 4.8 9.98C5.83 9.82 6.76 10.01 7.6 10.54C8.42 11.07 8.92 11.9 9.08 13.04C9.23 14.18 8.93 15.14 8.18 15.96C7.43 16.78 6.5 17.19 5.4 17.19C4.1 17.19 3.02 16.67 2.16 15.62C1.3 14.58 0.88 13.25 0.88 11.62C0.88 9.82 1.3 8.16 2.16 6.66C3.02 5.16 4.23 3.95 5.8 3.03C7.36 2.11 8.62 2 9.92 2ZM23.04 2L23.12 4C21.93 4.42 20.88 5.14 19.99 6.16C19.11 7.18 18.42 8.45 17.94 9.98C18.96 9.82 19.89 10.01 20.74 10.54C21.56 11.07 22.06 11.9 22.22 13.04C22.37 14.18 22.07 15.14 21.32 15.96C20.57 16.78 19.64 17.19 18.54 17.19C17.24 17.19 16.16 16.67 15.3 15.62C14.44 14.58 14.02 13.25 14.02 11.62C14.02 9.82 14.44 8.16 15.3 6.66C16.16 5.16 17.37 3.95 18.94 3.03C20.5 2.11 21.76 2 23.04 2Z" fill="currentColor"/>
          </svg>
        </div>
        <p className="text-lg text-zinc-300 flex-1 italic mb-6">{quote}</p>
        <div>
          <p className="font-medium text-white">{author}</p>
          <p className="text-sm text-zinc-400">{title}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
