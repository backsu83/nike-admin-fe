//react
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';

//css
import { Logo } from "components";

// img

export default function Header() {
  const navigate = useNavigate();
  const menuUrl = window.location.pathname.split('/')[1];
  const linkClick = (path) => {
    return navigate(path);
  }
  const activeStyle = {
    color :"#32F743"
  }

  return (
      <div className={styles.HeaderContainer}>

        <div className={styles.Logo} onClick={()=>{linkClick('/')}}>
          <Logo/>
        </div>

        <div className={styles.MenuList}>
          <p style={menuUrl == "order" ? activeStyle : null} onClick={()=>{linkClick('/order/list')}}>ORDER LIST</p>
          <p></p>
        </div>
        
        <p className={styles.Logout} onClick={()=>{linkClick('/')}}>LOG OUT</p>
        
      </div>
  );
}
