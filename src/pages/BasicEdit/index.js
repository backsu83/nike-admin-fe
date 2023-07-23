import React from "react";
import { useNavigate } from 'react-router-dom';
import { Header,BorderLayoutBox,BasicEditContent } from "components";
import styles from './style.module.scss';


function BasicEditPage() {

  const navigate = useNavigate()
  const LinkClick = () => {
    return navigate('/menu');
  }

  return (
    <div className={styles.Container}>
      <Header/>

      <div className={styles.BoxWrap}>
        <BorderLayoutBox>
          <BasicEditContent/>
        </BorderLayoutBox>
      </div>
    </div>
  );
}

export default BasicEditPage;
