import React from "react";
import { useNavigate } from 'react-router-dom';
import { Header,BorderLayoutBox,ProductEditContent } from "components";
import styles from './style.module.scss';


function ProductEditPage() {

  const navigate = useNavigate()
  const LinkClick = () => {
    return navigate('/menu');
  }

  return (
    <div className={styles.Container}>
      <Header/>

      <div className={styles.BoxWrap}>
        <BorderLayoutBox>
          <ProductEditContent/>
        </BorderLayoutBox>
      </div>
    </div>
  );
}

export default ProductEditPage;
