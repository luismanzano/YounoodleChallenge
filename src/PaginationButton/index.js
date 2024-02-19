import React from 'react';
import './styles.css';

const PaginationButton = ({ text, href }) => {
  return (
    <a href={href}>
      {text}
    </a>
  );
};

export default PaginationButton;