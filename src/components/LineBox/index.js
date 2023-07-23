//react
import React from "react";
import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';

//css
import { BackBtn } from "components";

// img

export default function LineBox({children}) {
  const navigate = useNavigate();
  const linkClick = (path) => {
    return navigate(path);
  }

  return (
      <div className={styles.Container}>
        <div className={styles.Innder}>
          {children}
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      </div>
  );
}
