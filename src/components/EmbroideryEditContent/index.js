import React from "react";
import { useNavigate,useParams } from 'react-router-dom';
import styles from './style.module.scss'
import { Button } from "components";

// img
import IconBack from 'resources/icon/icon_back.svg'


function EmbroideryEditContent() {
  const navigate = useNavigate();
  const { type } = useParams();

  const LinkClick = (path) => {
    return navigate(path);
  }

  return (
    <div className={styles.Container}>
      <div style={{backgroundColor: "#000000"}} className={styles.DetailTitleBox}>
        <p>자수</p>
        <img src={IconBack} alt="뒤로가기" onClick={()=>{LinkClick(-1)}}/>
      </div>

      <div className={styles.DetailWrap}>
        <div className={styles.DetailImgWrap}> 
          <p className={styles.DetailTitle}>작업영역 보드</p>
          <div className={styles.Imgbox}>
            {/* <img src={GuideImg} alt="" /> */}
            <button>이미지 등록</button>
          </div>
        </div>

        <div className={styles.DetailInfoWrap}>
          <div className={styles.DetailInfoInner}>
            <div className={styles.DetailInfoTop}>
              <div className={styles.DetailInfoBox}>
                <p className={styles.DetailTitle}>옵션 정보</p>
                <div className={styles.InfoContent}>
                  <div className={styles.InputRow}>
                    <p>NAME :</p>
                    <input type="text" placeholder="NBY 프리디자인_NO.01"/>
                  </div>
                  <div className={styles.InputRow}>
                    <p>가격 :</p>
                    <input type="text" placeholder="10,000원"/>
                  </div>
                </div>
              </div>
              <div className={styles.DetailInfoBox}>
                <p className={styles.DetailTitle}>자수 파일
                  <div className={styles.FileBtn}>
                    <input type="file" id="filepic"/>
                    <label htmlFor="filepic">등록</label>
                  </div>
                </p>
                <div className={styles.InfoContent}>
                  <div className={styles.FileUpload}>
                    <p>파일명</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.DetailInfoFullBox}>
              <p className={styles.DetailTitle}>작업 범위</p>
              <div className={styles.InfoContent}>
                <div className={styles.CategoryWrap}>
                  <div className={styles.CategoryBox}>
                    <input type="radio" name="category" id="chk1"/>
                    <label htmlFor="chk1">ALL</label>
                  </div>
                  <div className={styles.CategoryBox}>
                    <input type="radio" name="category" id="chk2" className={styles.Blue}/>
                    <label htmlFor="chk2">PHOTO SCAN PRINTING</label>
                  </div>
                  <div className={styles.CategoryBox}>
                    <input type="radio" name="category" id="chk3" className={styles.Green}/>
                    <label htmlFor="chk3">NBY DIGITAL PRINTING</label>
                  </div>
                  <div className={styles.CategoryBox}>
                    <input type="radio" name="category" id="chk4" className={styles.Purple}/>
                    <label htmlFor="chk4">EMBROIDERY</label>
                  </div>
                  <div className={styles.CategoryBox}>
                    <input type="radio" name="category" id="chk5" className={styles.Red}/>
                    <label htmlFor="chk5">LASER GUN PRINTING</label>
                  </div>
                </div>
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

export default EmbroideryEditContent;
