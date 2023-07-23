import React from "react";
import styles from './style.module.scss';

function Button({title,link}) {
  return (
    <div className={styles.Button}>
      <button onClick={link}>{title}</button>
    </div>
  );
}

export default Button;
