//react
import React from "react";
import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';

//css
import { BackBtn } from "components";

// img
import MainLogo from 'resources/icon/main_logo.svg'

export default function Logo() {
  const navigate = useNavigate();

  return (
      <img src={MainLogo} alt="nike" className={styles.Logo} />
  );
}
