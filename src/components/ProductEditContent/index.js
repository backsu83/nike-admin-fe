
import React, { useEffect, useState } from "react";
import { useNavigate,useParams,useLocation } from 'react-router-dom';
import styles from './style.module.scss'
import { Button } from "components";

// img
import IconBack from 'resources/icon/icon_back.svg'
import GuideImg from 'resources/image/product_img1.png'
import OptionGuideImg from 'resources/image/product_img3.png'
import SampleGuideImg from 'resources/image/gide_img.png'
import IconAll from 'resources/icon/icon_all.svg'
import IconNone from 'resources/icon/icon_color_none.svg'

import useOptions from 'hooks/useOptions';
import FABRIC from 'hooks/useFabric';
import {fabric} from 'fabric';

import API from 'api';

function ProductEditContent() {

  const [isColorModal, setIsColorModal] = useState(false);
  const [isSizeModal, setIsSizeModal] = useState(false);
  const [productDetail, setProductDetail] = useState({
     name : "",
     code : "",
     category : "",
  });

  const optionSizeList = [ "S","M","L","XL","2XL","3XL","4XL","없음" ]
  const colorNameList = [
    { color : "white", title:"화이트"},
    { color : "black", title:"블랙"},
    { color : "blue", title:"블루"},
    { color : "grey", title:"회색"},
    { color : "", title:"없음"},
  ]

  const optionEvent = useOptions();
  const { optionRef,onChangeOptionImages,isAddOption, refreshOptions,optionList,setProductId, setOptionList,optionInfo, setOptionInfo } = optionEvent;

  const location = useLocation();

  const navigate = useNavigate();
  const { type } = useParams();
  const [ image, setImage ] = useState(null);
  const [ isEditMode, setIsEditMode ] = useState(false);
  const [ imageSrc, setImageSrc ] = useState(null);
  const { fabricRef } = FABRIC();
  const [filter,setFilter] = useState({
    category:{
      ALL : { checked : false},
      QR : { checked : false},
      laser : { checked : false},
      print : { checked : false},
      embroidery : { checked : false},
    }
  });

  function generateFilter(category){

    if(category === "ALL"){
        setFilter(e=>{
          let state = JSON.parse(JSON.stringify(e));
          state.category["ALL"].checked = !e.category["ALL"].checked;
          state.category["QR"].checked = !e.category["ALL"].checked;
          state.category["print"].checked = !e.category["ALL"].checked;
          state.category["embroidery"].checked = !e.category["ALL"].checked;
          state.category["laser"].checked = !e.category["ALL"].checked;
          return { ...state };
        })
    }else
      setFilter(e => {
        let state = JSON.parse(JSON.stringify(e));
        state.category[category].checked = !state.category[category].checked;
        let isAllCheck = true;
        for(let key in state.category){
          if(key !== "ALL" && !state.category[key].checked){
            isAllCheck = false;
          }
        }
        state.category["ALL"].checked = isAllCheck;
        return {...state};
      });
  }


  const encodeFileToBase64 = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    setImage(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImageSrc(reader.result);
        resolve();
      };
    });
  };



  const getImageSrc = async (fileParam) => {
    const file = new File([fileParam], new Date().getTime() + ".png");
    const formData = new FormData();
    formData.append("images", file);
    return await (await API.uploadImage(formData)).json();
  }

  const onInsertProduct = async () => {

    let product = {
      thumbnail : imageSrc,
      img : imageSrc,
      name : productDetail.name,
      category : productDetail.category,
      price : productDetail.price ? productDetail.price.toString() : "0"
    }


    if(image){
      let response = await getImageSrc(image);
      product.img = response.img;
      product.thumbnail = response.img;
      setImageSrc(product.img);
    }

    if(location.state && location.state.id){
      product.id = location.state.id;
      if(!product.category){
        alert("카테고리를 선택해주세요");
        return;
      }
      await API.updateProduct({product : product});
    }else{
      let isChange = false;
      for(let key in filter.category){
        if(key != "ALL" && filter.category[key].checked){
          product.category = key;
          isChange = true;
          await API.insertProduct({product : product});
        }
      }
      if(isChange === false){
        alert("필터를 선택해주세요");
        return;
      }

      alert("NAME : " + productDetail.name  + " 상품 등록이 완료되었습니다. 리스트에서 새로 접속 부탁드리겠습니다.");
      window.history.back();
    }

    alert("적용 완료되었습니다.");
  }

  const saveMaskArea = async () => {

    if((location.state && location.state.id) === false){
      alert("상품 등록 후 설정 가능합니다.");
      return;
    }

    let saveJSON = JSON.stringify(fabricRef.current);
    let json = JSON.parse(saveJSON);
    let ob = json.objects[0];
    let width = ob.width * ob.scaleX;
    let height = ob.height * ob.scaleY;
    let left = ob.left;
    let top = ob.top;


    let product = {
      id : location.state.id,
      masking_x: left,
      masking_y: top,
      masking_width: width,
      masking_height: height,
    }

    await API.updateProduct({product : product});
    alert("적용 완료되었습니다.");
  }

  const editMaskArea = () => {

    if((location.state && location.state.id) === false){
      alert("상품 등록 후 설정 가능합니다.");
      return;
    }

    if(imageSrc || location.state){
      setIsEditMode(true);
    }
  }

  const LinkClick = (path) => {
    return navigate(path);
  }

  const useFabric = (canvas) => {
    const fabricRef = React.useCallback((element) => {
      if (!element) return canvas.current?.dispose();

      canvas.current = new fabric.Canvas(
          element,
          {},
      );

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      let state = location.state;
      var rect = new fabric.Rect({
        width: state && state.masking_width ? state.masking_width : 100,
        height: state && state.masking_height  ? state.masking_height : 100,
        top: state && state.masking_y  ? state.masking_y : ((vw * (600/1920) ) / 2) / 1.5,
        left: state && state.masking_x  ? state.masking_x : ((vw * (604/1920)) / 2) / 1.5,
        fill: 'rgba(0,0,0,0)',
        stroke:"#32F743",
        strokeWidth:2,
        strokeDashArray:[5,5,5]
      });

      canvas.current.add(rect);

    }, []);
    return fabricRef;
  };

  function updateProductRange(range){
    setProductDetail(e=>{ e["category"] = range; return {...e};});
  }

  function onUpdateDetail(event){
    setProductDetail(e=>{ e[event.target.name] = event.target.value; return {...e};})
  }
  function onUpdateOptionInfo(value,name){
    setOptionInfo(e=>{ e[name] = value; return {...e};});
    setIsSizeModal(false);
    setIsColorModal(false);
  }

  async function onDeleteEvent(){
    if(location.state && location.state.id){
      await API.deleteProduct(location.state.id);
      alert("삭제 성공하였습니다.");
      window.history.back();
    }else{
      alert("삭제가 불가능합니다.");
    }
  }

  const moveToOptionAssetEditPage = (option) => {
    option.product_id = location.state.id;
    return navigate("/product/option",{state:{ option : option}});
  }

  function MyFabric(props) {
    const {canvas} = props;
    const fabricRef = useFabric(canvas);
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    return (
        <canvas
          ref={fabricRef}
          width={450}
          height={450 * (2000/1620)}
        />
    );
    // const {canvas,initRef} = props;
    // const fabricRef = useFabric(canvas);
    // const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    // return <canvas ref={fabricRef} width={450} height={320} />;
  }

  useEffect(()=>{
    let state = location.state;
    if(state){
      setImageSrc(state.thumbnail);
      setProductDetail((e)=>{
        e.code = state.code;
        e.price = state.price;
        e.name = state.name;
        e.category = state.category;
        return {...e}
      });
      setOptionList(state.options);
      setProductId(state.id);
      setIsEditMode(true);
    }else{
      setProductId(null); 
    }
    if(state && state.id)
      refreshOptions(state.id);
  },[location])

  return (
    <div className={styles.Container}>
      <div style={{backgroundColor: "#000000"}} className={styles.DetailTitleBox}>
        <p>{location.state && location.state.id ? "상품 수정" : "상품 등록"}</p>
        <img src={IconBack} alt="뒤로가기" onClick={()=>{LinkClick(-1)}}/>
      </div>

      <div className={styles.DetailWrap}>
        <div className={styles.DetailImgWrap}>
          <p className={styles.DetailTitle}>작업영역 보드</p>

          <div className={styles.Imgbox} onClick={editMaskArea}>
            {
              isEditMode ?
              <div className={styles.Canvas}>
                <MyFabric canvas={fabricRef} />
              </div>
              :
              null
            }
            <img src={imageSrc} alt="" />
            <button onClick={saveMaskArea}>저장하기</button>
          </div>
        </div>

        <div className={styles.DetailInfoWrap}>
          <div className={styles.DetailInfoInner}>
            <div className={styles.DetailInfoBox}>
              <p className={styles.DetailTitle}>상품정보</p>
              <div className={styles.InfoContent}>
                <div className={styles.InputRow}>
                  <p>NAME :</p>
                  <input type="text" value={productDetail.name} placeholder="0000후드" name="name" onChange={onUpdateDetail}/>
                </div>
                <div className={styles.InputRow}>
                  <p>PRICE :</p>
                  <input type="text" value={productDetail.price} placeholder="000dfefsadf00" name="price" onChange={onUpdateDetail}/>
                </div>
              </div>
            </div>
            <div className={styles.DetailInfoBox}>
              <p className={styles.DetailTitle}>대표 이미지
                <div className={styles.FileBtn}>
                  <input type="file" id="filepic" onChange={e=>encodeFileToBase64(e.target.files[0])}/>
                  <label htmlFor="filepic">이미지 등록</label>
                </div>
              </p>
              <div className={styles.InfoContent}>
                <div className={styles.FileUploadImg}>
                  <div>
                    <img src={imageSrc} alt="" />
                  </div>
                  <p>{image ? image.name : imageSrc ? imageSrc.split("/")[imageSrc.split("/").length - 1].slice(0,8) : ""}</p>
                </div>
              </div>
            </div>
            <div className={styles.DetailInfoFullBox}>
              <p className={styles.DetailTitle}>상품 옵션 설정 <button onClick={()=>{ optionEvent.openEditOption({}); }}>옵션 추가</button></p>
              <div className={styles.InfoContent}>
                <div ref={optionRef} className={styles.OptionEditWrap}>

                   {/* 옵션 추가 및 첫등록시 레이아웃 */}
                    {
                     isAddOption &&
                    <div className={styles.OptionEditBox} style={{border: "1px solid #000000"}}>
                      <div className={styles.OptionEditImg}><img src={optionInfo.img} alt="" /></div>
                      <div className={styles.OptionEditInfo}>
                        <p className={styles.OptionEditType} onClick={()=>{setIsColorModal(!isColorModal);setIsSizeModal(false);}}>
                          컬러 :
                          <span className={styles.OptionText}>{ optionInfo.color ? optionInfo.color.title :"옵션선택" }</span>
                        </p>
                        <p className={styles.OptionEditType} onClick={()=>{setIsSizeModal(!isSizeModal);setIsColorModal(false);}}>
                          사이즈 : <span className={styles.OptionText}>{ optionInfo.size ? optionInfo.size :"옵션선택" }</span>
                        </p>
                        <p className={styles.OptionEditType}>
                          가격 : <input className={styles.OptionText} type={"text"} value={optionInfo.price} name={"price"} onChange={(e)=>{onUpdateOptionInfo(e.target.value,"price")}}/>
                        </p>
                        {/* 컬러 옵션선택 */}
                        {
                          isColorModal &&
                          <div className={styles.OptionColorModal}>
                            {
                              colorNameList.map((value)=>{
                                if(value.color)
                                  return <p name="color" onClick={()=>{onUpdateOptionInfo(value,"color")}}><i style={{backgroundColor: value.color}}></i>{value.title}</p>
                                else
                                  return <p name="color" onClick={()=>{onUpdateOptionInfo(value,"color")}}><img src={IconNone} alt="" /> 없음</p>
                              })
                            }
                          </div>
                        }
                        {
                          isSizeModal &&
                          <div className={styles.OptionSizeModal}>
                            {
                              optionSizeList.map((value)=>{
                                return <p name="size" onClick={()=>{onUpdateOptionInfo(value,"size")}}>{value}</p>
                              })
                            }
                          </div>
                        }
                      </div>
                      <div className={styles.OptionEditBtn}>
                        <input
                          hidden
                          id="optionEdit"
                          title={"이미지 추가"}
                          type={"file"}
                          multiple={true}
                          maxLength={2}
                          onChange={onChangeOptionImages}
                        />
                        <label for={"optionEdit"}>이미지 추가</label>
                        <button onClick={()=>{optionEvent.setIsAddOption(false);}}>취소</button>
                        <button onClick={optionEvent.insertOptionEvent}>저장</button>
                      </div>
                    </div>
                  }
                  {
                    optionList.map((value,index)=>{
                      if(value.isEdit){
                        return (
                          <div className={styles.OptionEditBox} style={{border: "1px solid #000000"}}>
                            <div className={styles.OptionEditImg}><img src={optionInfo.img} alt="" /></div>
                            <div className={styles.OptionEditInfo}>
                              <p className={styles.OptionEditType} onClick={()=>{setIsColorModal(!isColorModal);setIsSizeModal(false);}}>
                                컬러 :
                                <span className={styles.OptionText}>{ optionInfo.color ? optionInfo.color.title :"옵션선택" }</span>
                              </p>
                              <p className={styles.OptionEditType} onClick={()=>{setIsSizeModal(!isSizeModal);setIsColorModal(false);}}>
                                사이즈 : <span className={styles.OptionText}>{ optionInfo.size ? optionInfo.size :"옵션선택" }</span>
                              </p>
                              <p className={styles.OptionEditType}>
                                가격 : <input className={styles.OptionText} type={"text"} value={optionInfo.price} name={"price"} onChange={(e)=>{onUpdateOptionInfo(e.target.value,"price")}}/>
                              </p>
                              {/* 컬러 옵션선택 */}
                              {
                                isColorModal &&
                                <div className={styles.OptionColorModal}>
                                  {
                                    colorNameList.map((value)=>{
                                      if(value.color)
                                        return <p name="color" onClick={()=>{onUpdateOptionInfo(value,"color")}}><i style={{backgroundColor: value.color}}></i>{value.title}</p>
                                      else
                                        return <p name="color" onClick={()=>{onUpdateOptionInfo(value,"color")}}><img src={IconNone} alt="" /> 없음</p>
                                    })
                                  }
                                </div>
                              }
                              {
                                isSizeModal &&
                                <div className={styles.OptionSizeModal}>
                                  {
                                    optionSizeList.map((value)=>{
                                      return <p name="size" onClick={()=>{onUpdateOptionInfo(value,"size")}}>{value}</p>
                                    })
                                  }
                                </div>
                              }
                            </div>
                            <div className={styles.OptionEditBtn}>
                              <input
                                hidden
                                id="optionEdit"
                                title={"이미지 추가"}
                                type={"file"}
                                multiple={true}
                                maxLength={2}
                                onChange={onChangeOptionImages}
                              />
                              <label for={"optionEdit"}>이미지 추가</label>
                              <button onClick={()=>{optionEvent.setIsAddOption(false);}}>취소</button>
                              <button onClick={optionEvent.insertOptionEvent}>저장</button>
                            </div>
                          </div>
                        );
                      }else{
                        return(
                          <div className={styles.OptionEditBox}>
                            <div className={styles.OptionEditImg}><img src={value.img} alt="" /></div>
                            <div className={styles.OptionEditInfo}>
                              <p>컬러 : <span><i style={{backgroundColor: value.color}}></i>{value.color}</span></p>
                              <p>사이즈 : <span>{value.size}</span></p>
                              <p>가격 : <span>{value.price && value.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</span></p>
                            </div>
                            <div className={styles.OptionEditBtn}>
                              <button onClick={()=>{ moveToOptionAssetEditPage(value);  }}>에셋 수정</button>
                              <button onClick={()=>{optionEvent.deleteOptionEvent(value.id)}}>삭제</button>
                              <button onClick={()=>{optionEvent.openEditOption(value)}}>수정</button>
                            </div>
                          </div>
                        )
                      }

                    })
                  }
                </div>
              </div>
            </div>



            <div className={styles.DetailInfoFullBox}>
              <p className={styles.DetailTitle}>작업 범위</p>
              <div className={styles.InfoContent}>
                {
                  location.state && location.state.id ?
                  <div className={styles.CategoryWrap}>
                    <div className={styles.CategoryBox} onClick={()=>{updateProductRange("QR")}}>
                      <input type="radio" name="category" id="chk2" className={styles.Blue} checked={productDetail && productDetail.category === "QR"}/>
                      <label htmlFor="chk2">PHOTO SCAN PRINTING</label>
                    </div>
                    <div className={styles.CategoryBox} onClick={()=>{updateProductRange("print")}}>
                      <input type="radio" name="category" id="chk3" className={styles.Green} checked={productDetail && productDetail.category === "print"}/>
                      <label htmlFor="chk3">NBY DIGITAL PRINTING</label>
                    </div>
                    <div className={styles.CategoryBox} onClick={()=>{updateProductRange("embroidery")}}>
                      <input type="radio" name="category" id="chk4" className={styles.Purple} checked={productDetail && productDetail.category === "embroidery"}/>
                      <label htmlFor="chk4">EMBROIDERY</label>
                    </div>
                    <div className={styles.CategoryBox} onClick={()=>{updateProductRange("laser")}} >
                      <input type="radio" name="category" id="chk5" className={styles.Red} checked={productDetail && productDetail.category === "laser"}/>
                      <label htmlFor="chk5">LASER GUN PRINTING</label>
                    </div>
                  </div>
                  :
                  <div className={styles.CategoryWrap}>
                    <div className={styles.CategoryBox} onClick={(e)=>{generateFilter("ALL"); e.preventDefault();}}>
                      <input type="checkbox" name="checkbox" id="chk1" checked={filter.category["ALL"].checked} onClick={(e)=>{e.stopPropagation(); generateFilter("ALL"); }}/>
                      <label htmlFor="chk1" >ALL</label>
                    </div>
                    <div className={styles.CategoryBox} onClick={(e)=>{generateFilter("QR"); e.preventDefault();}}>
                      <input type="checkbox" name="checkbox" id="chk2" className={styles.Blue} checked={filter.category["QR"].checked} onClick={(e)=>{e.stopPropagation(); generateFilter("QR"); }}/>
                      <label htmlFor="chk2">PHOTO SCAN PRINTING</label>
                    </div>
                    <div className={styles.CategoryBox} onClick={(e)=>{generateFilter("print"); e.preventDefault();}}>
                      <input type="checkbox" name="checkbox" id="chk3" className={styles.Green} checked={filter.category["print"].checked} onClick={(e)=>{e.stopPropagation();  generateFilter("print"); }}/>
                      <label htmlFor="chk3">NBY DIGITAL PRINTING</label>
                    </div>
                    <div className={styles.CategoryBox} onClick={(e)=>{generateFilter("embroidery"); e.preventDefault();}}>
                      <input type="checkbox" name="checkbox" id="chk4" className={styles.Purple} checked={filter.category["embroidery"].checked} onClick={(e)=>{e.stopPropagation(); generateFilter("embroidery"); }}/>
                      <label htmlFor="chk4">EMBROIDERY</label>
                    </div>
                    <div className={styles.CategoryBox} onClick={(e)=>{generateFilter("laser"); e.preventDefault();}}>
                      <input type="checkbox" name="checkbox" id="chk5" className={styles.Red} checked={filter.category["laser"].checked} onClick={(e)=>{e.stopPropagation(); generateFilter("laser"); }}/>
                      <label htmlFor="chk5">LASER GUN PRINTING</label>
                    </div>
                </div>
                }


              </div>
            </div>
          </div>
          <div className={styles.PriceWrap}>
            <div>
              <Button title="DELETE"link={onDeleteEvent}/>
              <Button title="SAVE" link={onInsertProduct}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductEditContent;
