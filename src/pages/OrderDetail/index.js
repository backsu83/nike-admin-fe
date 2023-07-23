import React from "react";
import { useNavigate } from 'react-router-dom';
import { Header,BorderLayoutBox,OrderDetailContent } from "components";
import styles from './style.module.scss';


function OptionDetail() {

  const navigate = useNavigate()
  const LinkClick = () => {
    return navigate('/menu');
  }

  return (
    <div className={styles.Container}>
      <Header/>

      <div className={styles.BoxWrap}>
        <BorderLayoutBox>
          <OrderDetailContent/>
        </BorderLayoutBox>
      </div>
    </div>
  );
}

export default OptionDetail;
