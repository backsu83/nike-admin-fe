import React from "react";
import { useNavigate } from 'react-router-dom';
import { Header,BorderLayoutBox,EmbroideryEditContent } from "components";
import styles from './style.module.scss';


function EmbroideryEditPage() {

  const navigate = useNavigate()
  const LinkClick = () => {
    return navigate('/menu');
  }

  return (
    <div className={styles.Container}>
      <Header/>

      <div className={styles.BoxWrap}>
        <BorderLayoutBox>
          <EmbroideryEditContent title={"자수"}/>
        </BorderLayoutBox>
      </div>
    </div>
  );
}

export default EmbroideryEditPage;
