import React from "react";
import { useNavigate,useParams } from 'react-router-dom';
import styles from './style.module.scss'
import { Button } from "components";

// img
import IconBack from 'resources/icon/icon_back.svg'


function BasicEditContent() {
  const navigate = useNavigate();
  const { type } = useParams();

  const LinkClick = (path) => {
    return navigate(path);
  }

  return (
    <div className={styles.Container}>
      <div style={{backgroundColor: "#000000"}} className={styles.DetailTitleBox}>
        <p>기본 - {type == 0 ? "커스텀 드로잉" : "포토 스캔"}</p>
        <img src={IconBack} alt="뒤로가기" onClick={()=>{LinkClick(-1)}}/>
      </div>

      <div className={styles.DetailWrap}>
        <div className={styles.DetailInfoWrap}>
          <div className={styles.DetailInfoBox}>
            <p className={styles.DetailTitle}>가격정보</p>
            <div className={styles.InfoContent}>
              <div className={styles.InputRow}>
                <p>가격 :</p>
                <input type="text" placeholder="10,000원"/>
              </div>
            </div>
          </div>
          <div className={styles.PriceWrap}>
            <div>
              <Button title="CANCEL"/>
              <Button title="NEXT"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicEditContent;
