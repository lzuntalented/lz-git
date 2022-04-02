import React from 'react';
import style from './index.module.css';

interface BoxProps {
  children?: React.ReactChild
  header?: React.ReactChild
  className?: string
}

function Box({ children, header, className = '' }: BoxProps) {
  return (
    <div className={`${style.comp} ${className}`}>
      <div className={style.header}>{header}</div>
      <div className={style.content}>{children}</div>
    </div>
  );
}

export default Box;
