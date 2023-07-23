import React from "react";
import { useNavigate } from 'react-router-dom';
import { Header,BorderLayoutBox,OptionDetailContent } from "components";
import styles from './style.module.scss';


function OrderDetailPage() {

  const navigate = useNavigate()
  const LinkClick = () => {
    return navigate('/menu');
  }

  return (
    <div className={styles.Container}>
      <Header/>

      <div className={styles.BoxWrap}>
        <BorderLayoutBox>
          <OptionDetailContent/>
        </BorderLayoutBox>
      </div>
    </div>
  );
}

export default OrderDetailPage;
