import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss'
import { SearchBar } from "components";
import { numberWithCommas } from "utils/Commas";
import useProductListStateA from "hooks/useProductListStateA";
import useProductListStateB from "hooks/useProductListStateB";
import useProductListStateC from "hooks/useProductListStateC";
import useProductListStateD from "hooks/useProductListStateD";

// img
import IconAll from 'resources/icon/icon_color.svg'

function ProductListContent({list,assetList}) {
  const [filter,setFilter] = useState({
    category:{ 
      ALL : { checked : true},
      QR : { checked : true},
      laser : { checked : true},
      print : { checked : true},
      embroidery : { checked : true},
    }}
  );
  const navigate = useNavigate();
  const listA = useProductListStateA();
  const listB = useProductListStateB();
  const listC = useProductListStateC();
  const listD = useProductListStateD();

  const LinkClick = (path,value) => {
    return navigate(path,{state:value});
  }
  const activeStyle = (type) => {
    if(type == "all"){return {backgroundImage : `url(${IconAll})`}}
    else if(type == "print"){return {backgroundColor : "#22AB2E"};}
    else if(type == "QR"){return {backgroundColor : "#2266AB"}}
    else if(type == "laser"){return {backgroundColor : "#AB3222"}}
    else if(type == 4){return {backgroundColor : "#AB3222"}}
    else return {backgroundColor:"#5C22AB"}
  }

  const getCommaStr = (options,type) => {
    let sizeKeyMap = {};
    let str = "";

    options.map((option,index) => {
      if(sizeKeyMap[option[type]])
        return null;
      sizeKeyMap[option[type]] = true;
      str += option[type] + ", ";
    })

    return str.slice(0,-2);
  }

  function getListLength(paramList){
    return paramList && paramList.filter(v=>((filter.category[v.category] && filter.category[v.category].checked) || filter.category["ALL"].checked)).length;
  }

  return (
    <div className={styles.Container}>
      <SearchBar filter={filter} setFilter={setFilter}/>
      <div className={styles.OrderListWrap}> 
        <div className={styles.OrderInner}>
          <div className={styles.OrderBox}>
            <div className={styles.OrderTitleBtnWrap}>
              <p className={styles.OrderTitle}>상품<span>{getListLength(list)}개</span></p>
              <button onClick={()=>{LinkClick('/product/add')}}>등록</button>
            </div>
            <div className={styles.ListWrap}>
              {
                list && list.filter(v=>(
                  (filter.category[v.category] && filter.category[v.category].checked) || filter.category["ALL"].checked
                )).map((value,index)=>{

                  let options = value.options;

                  return(
                    <div className={styles.ListBox}>
                      <div className={styles.ListTitleBox}>
                        <p>{value.name}</p> <button onClick={()=>{LinkClick(`/product/edit/${value.id}`,value)}}>수정</button>
                      </div>
                      <div className={styles.RowListContent}>
                        <div>
                          <p>제품 코드 : {value.code}</p>
                          <p>
                            사이즈 : 
                            {
                              options ? 
                              getCommaStr(options,"size")
                              : "없음"}
                          </p>
                          <p>
                          컬러 : 
                            {
                              options ? 
                              getCommaStr(options,"color")
                              : "없음"}
                          </p>
                          <p className={styles.SubTitle}>상품 가격<br /><span className={styles.Price}>{numberWithCommas(value.price)}원</span></p>
                          <p className={styles.SubTitle}>작업범위<br />
                            <p className={styles.ColorChip}>
                            <span style={activeStyle(value.category)}></span>
                              {/* {value.work.map((v,i)=>{
                                return(
                                  <span style={activeStyle(v)}></span>
                                )
                              })} */}
                            </p>
                          </p>
                          <p>등록(수정)일 : {value["registered_at"]}</p>
                        </div>
                        <div className={styles.ListImgBox}>
                          <img src={value.thumbnail} alt="" />
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className={styles.OrderBox}>
            <div className={styles.OrderTitleBtnWrap}>
              <p className={styles.OrderTitle}>에셋<span>{getListLength(assetList)}개</span></p>
              <button onClick={()=>{LinkClick('/product/asset/edit/0')}}>등록</button>
            </div>
            <div className={styles.ListWrap}>
              {
                assetList && assetList.filter(v=>(
                  (filter.category[v.category] && filter.category[v.category].checked) || filter.category["ALL"].checked
                  && v.custom_id === null && v.category !== "laser"
                )).map((value,index)=>{
                  return(
                    <div className={styles.ListBox}>
                      <div className={styles.ListTitleBox}>
                        <p>NBY 프리 디자인_NO.{value.id}</p> <button onClick={()=>{LinkClick(`/product/asset/edit/${value.id}`,value)}}>수정</button>
                      </div>
                      <div className={styles.RowListContent}>
                        <div>
                          <p>상품 가격 : <span className={styles.Price}>{numberWithCommas(value.price)}원</span></p>
                          <p className={styles.SubTitle}>작업범위<br />
                            {/* <p className={styles.ColorChip}>
                              {value.work.map((v,i)=>{
                                return(
                                  <span style={activeStyle(v)}></span>
                                )
                              })}
                            </p> */}
                          </p>
                          <p>등록(수정)일 : {value["registered_at"]}</p>
                        </div>
                        <div className={styles.ListLogoBox}>
                          <img src={value.img} alt="" />
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className={styles.OrderBox}>
            <div className={styles.OrderTitleBtnWrap}>
              <p className={styles.OrderTitle}>커스텀 드로잉 에셋</p>
              {/* <button onClick={()=>{LinkClick(`/product/embroidery/edit/${0}`)}}>등록</button> */}
            </div>
            <div className={styles.ListWrap}>
            {
                assetList && assetList.filter(v=>(
                  ((filter.category[v.category] && filter.category[v.category].checked) || filter.category["ALL"].checked)
                  && v.custom_id && v.category === "laser"
                )).map((value,index)=>{
                  return(
                    <div className={styles.ListBox}>
                      <div className={styles.ListTitleBox}>
                        <p>NBY 프리 디자인_NO.{value.id}</p> <button onClick={()=>{LinkClick(`/product/asset/edit/${value.id}`,value)}}>수정</button>
                      </div>
                      <div className={styles.RowListContent}>
                        <div>
                          <p>상품 가격 : <span className={styles.Price}>{numberWithCommas(value.price)}원</span></p>
                          <p className={styles.SubTitle}>작업범위<br />
                            {/* <p className={styles.ColorChip}>
                              {value.work.map((v,i)=>{
                                return(
                                  <span style={activeStyle(v)}></span>
                                )
                              })}
                            </p> */}
                          </p>
                          <p>등록(수정)일 : {value.date}</p>
                        </div>
                        <div className={styles.ListLogoBox}>
                          <img src={value.img} alt="" />
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className={styles.OrderBox}>
            <div className={styles.OrderTitleBtnWrap}>
              <p className={styles.OrderTitle}>QR 포토스캔 업로드</p>
              {/* <button onClick={()=>{LinkClick('/product/basic/edit/0/0')}}>등록</button> */}
            </div>
            <div className={styles.ListWrap}>
            {
                assetList && assetList.filter(v=>(
                  ( (filter.category[v.category] && filter.category[v.category].checked) || filter.category["ALL"].checked) 
                     && v.custom_id && v.category === "QR"
                  )).map((value,index)=>{
                  return(
                    <div className={styles.ListBox}>
                      <div className={styles.ListTitleBox}>
                        <p>NBY 프리 디자인_NO.{value.id}</p> <button onClick={()=>{LinkClick(`/product/asset/edit/${value.id}`,value)}}>수정</button>
                      </div>
                      <div className={styles.RowListContent}>
                        <div>
                          <p>상품 가격 : <span className={styles.Price}>{numberWithCommas(value.price)}원</span></p>
                          <p className={styles.SubTitle}>작업범위<br />
                            {/* <p className={styles.ColorChip}>
                              {value.work.map((v,i)=>{
                                return(
                                  <span style={activeStyle(v)}></span>
                                )
                              })}
                            </p> */}
                          </p>
                          <p>등록(수정)일 : {value.date}</p>
                        </div>
                        <div className={styles.ListLogoBox}>
                          <img src={value.img} alt="" />
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductListContent;
