import React from "react";
import styles from './style.module.scss'


function BorderLayoutBox({children}) {

  return (
    <div className={styles.LayoutContainer}>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      {children}
    </div>
  );
}

export default BorderLayoutBox;
