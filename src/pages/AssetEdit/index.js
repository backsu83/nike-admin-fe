import React from "react";
import { useNavigate } from 'react-router-dom';
import { Header,BorderLayoutBox,AssetEditContent } from "components";
import styles from './style.module.scss';


function AssetEditPage() {

  const navigate = useNavigate()
  const LinkClick = () => {
    return navigate('/menu');
  }

  return (
    <div className={styles.Container}>
      <Header/>

      <div className={styles.BoxWrap}>
        <BorderLayoutBox>
          <AssetEditContent/>
        </BorderLayoutBox>
      </div>
    </div>
  );
}

export default AssetEditPage;
