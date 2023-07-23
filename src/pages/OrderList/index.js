import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Header,BorderLayoutBox,OrderListContent } from "components";
import styles from './style.module.scss';


function OrderListPage() {


  const navigate = useNavigate()
  const LinkClick = () => {
    return navigate('/menu');
  }

  return (
    <div className={styles.Container}>
      <Header/>

      <div className={styles.BoxWrap}>
        <BorderLayoutBox>
          <OrderListContent/>
        </BorderLayoutBox>
      </div>
    </div>
  );
}

export default OrderListPage;
