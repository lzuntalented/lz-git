import React from 'react';
import style from './index.module.css';

interface AvatarProps {
  url?: string
  name: string
  width?: number
}
function Avatar({ url, name, width = 20 }: AvatarProps) {
  return (
    url
      ? (
        <div>
          <img src={url} alt="" />
        </div>
      ) : (
        <span className={style.name} style={{ width, height: width }}>
          {name.split('')[0]}
        </span>
      )
  );
}

export default Avatar;
