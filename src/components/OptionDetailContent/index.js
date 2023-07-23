import React, { useEffect,useState } from "react";
import { useNavigate,useParams,useLocation } from 'react-router-dom';
import styles from './style.module.scss'
import { Button } from "components";

// img
import IconBack from 'resources/icon/icon_back.svg'
import GuideImg from 'resources/image/guide_img.png'
import GuideScanImg from 'resources/image/guide_scan_img.png'
import GuideDrawingImg from 'resources/image/guide_drawing_img.png'
import API from "api";
import useAssetList from "hooks/useAssetList";
import useProductList from "hooks/useProductList";

function OptionDetailContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const option = state.option;
  const [products] = useProductList();
  const [assetList,setAssetList] = useAssetList();
  const [optionAssetList,setOptionAssetList] = useState(option.assets);
  const [isLoad,setIsLoad] = useState(false);

  const LinkClick = (path) => {
    return navigate(path);
  }

  useEffect(()=>{
    if(assetList && assetList.length > 0 && isLoad == false){
      let ids = {};
      optionAssetList.map((value)=>{ ids[value.id] = true; });
      setAssetList(e=>{  let list = e.filter(v=> !ids[v.id] ); return [...list]});
      setIsLoad(true);
    }
  },[assetList]);

  async function doNextEvent(status){

    let result = await API.putOptionAsset(
      option.id,
      option.size, 
      option.color,
      option.price,
      option.product_id,
      optionAssetList ? optionAssetList : []
    );

    alert("반영 되었습니다. 리스트에서 확인해주세요");
    window.history.back();
  }

  function onUpdateUseAssetList(value){
    setOptionAssetList(e=>{
      setAssetList(li=>{ return [...[value].concat(li) ]; });
      return [...e.filter((v)=> v.id !== value.id).sort((a,b)=> a.id - b.id)]
    })
  }

  function onUpdateAssetList(value){
    setOptionAssetList(e => {
      let isIn = false;
      let list = e.filter((v)=> {
        if(v.id === value.id)
          isIn = true;
        return v.id != value.id;
      })
      
      if(isIn === false){
        list.push(value);
        setAssetList(li=>{ return [...li.filter(lv => lv.id != value.id)];});
      }
    
      return [...list.sort((a,b)=> a.id - b.id)]
    })
  }


  return (
    <div className={styles.Container}>
      <div style={{backgroundColor: "white"}} className={styles.DetailTitleBox}>
        <p style={{color:"black"}}>옵션 상세</p>
        <img src={IconBack} alt="뒤로가기" onClick={()=>{LinkClick(-1)}}/>
      </div>

      <div className={styles.DetailWrap}>
        <div className={styles.DetailImgWrap}>
          <p className={styles.DetailTitle}>옵션 이미지</p>
          <div className={styles.Imgbox}>
            <img src={option.img} alt="" />
          </div>
        </div>

        <div className={styles.DetailInfoWrap}>

          <div className={styles.DetailInfoFullBox}>
            <p className={styles.DetailTitle}>옵션 내용</p>
            <div className={styles.InfoContent}>
              <p>사이즈 : <span>{option.size}</span></p>
              <p>컬러 : <span>{option.color}</span></p>
              <p>가격 : <span>{option.price}</span></p>
              <p>생성일 : <span>{option.registered_at.split("T")[0]}</span></p>
            </div>
          </div>
          <div className={styles.DetailInfoBox}>
            <p className={styles.DetailSubTitle}><span>사용할 에셋 리스트</span></p>
            <div className={styles.InfoContent}>
              <div className={styles.OptionImgList}>
                {
                  optionAssetList &&
                  optionAssetList.map((value)=>{
                    return (
                      <div className={styles.OptionImgBox} onClick={()=>{onUpdateUseAssetList(value)}}>
                        <div className={styles.OptionImg}>
                          <img src={value.img} alt="" />
                        </div>
                        {/* <div>
                          <p>{value.price}원</p>
                        </div> */}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className={styles.DetailInfoBox}>
            <p className={styles.DetailSubTitle}><span>에셋 리스트</span></p>
            <div className={styles.InfoContent}>
              <div className={styles.OptionImgList}>
                {
                  assetList && assetList &&
                  assetList.map((value)=>{
                    return (
                      <div className={styles.OptionImgBox} onClick={()=>{onUpdateAssetList(value)}}>
                        <div className={styles.OptionImg}>
                          <img src={value.img} alt="" />
                        </div>
                        {/* <div>
                          <p>{value.price}원</p>
                        </div> */}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className={styles.PriceWrap}>
            <p></p>
            <div>
              <Button title="CANCEL" link={()=>{doNextEvent("cancel")}}/>
              <Button title="SAVE" link={()=>{doNextEvent()}}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OptionDetailContent;
