import React,{useEffect,useState} from "react";
import { useNavigate,useParams,useLocation } from 'react-router-dom';
import styles from './style.module.scss'
import { Button } from "components";

// img
import IconBack from 'resources/icon/icon_back.svg'
import GuideImg from 'resources/image/product_img1.png'
import OptionGuideImg from 'resources/image/product_img3.png'
import IconAll from 'resources/icon/icon_all.svg'

import API from 'api';

function EmbroideryEditContent() {
  const navigate = useNavigate();
  const { type } = useParams();
  const location = useLocation();
  const [ image, setImage ] = useState(null);
  const [ imageSrc, setImageSrc ] = useState(null);
  const [productDetail, setProductDetail] = useState({
     name : "",
     price : "",
     category : "",
  });
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

  const LinkClick = (path) => {
    return navigate(path);
  }



  const getImageSrc = async (fileParam) => {
    const file = new File([fileParam], new Date().getTime() + ".png");
    const formData = new FormData();
    formData.append("images", file);
    return await (await API.uploadImage(formData)).json();
  }

  const onInsertAssets = async () => {

    let asset = {
      thumbnail : imageSrc,
      img : imageSrc,
      name : productDetail.name,
      category : productDetail.category,
      // code : productDetail.code,
      price : productDetail.price,
    }

    if(image){
      let response = await getImageSrc(image);
      asset.img = response.img;
      setImageSrc(asset.img);
    }

    if(location.state && location.state.id){
      if(!asset.category){
        alert("카테고리를 선택해주세요");
        return;
      }
      await API.putAsset(location.state.id,asset.category, productDetail.price, asset.img);
    }else{
      let isChange = false;

      for(let key in filter.category){
        if(key != "ALL" && filter.category[key].checked){
          isChange = true;
          await API.postAsset(key, productDetail.price, asset.img);
        }
      }

      if(isChange === false){
        alert("필터를 선택해주세요");
        return;
      }
      alert("NAME : " + productDetail.name  + " 에셋 등록이 완료되었습니다. 리스트에서 새로 접속 부탁드리겠습니다.");
      window.history.back();
    }
    
    // setImage(null);
    alert("적용 완료되었습니다.");
  }

  async function onDeleteEvent(){
    if(location.state && location.state.id){
      await API.deleteAsset(location.state.id);
      alert("삭제 성공하였습니다.");
      window.history.back();
    }else{
      alert("삭제가 불가능합니다.");
    }
  }
  
  function updateProductRange(range){
    setProductDetail(e=>{ e["category"] = range; return {...e};});
  }

  function onUpdateDetail(event){
    setProductDetail(e=>{ e[event.target.name] = event.target.value; return {...e};}) 
  }

  useEffect(()=>{
    let state = location.state;
    if(state){
      setImageSrc(state.img);
      setProductDetail((e)=>{ 
        e.price = state.price;
        e.name = state.name;
        e.category = state.category;
        return {...e}
      });
    }
    
  },[location]);

  const ORDER_STATE ={"QR": {title:"PHOTO SCAN PRINTING"},"print":{title:"NBY DIGITAL PRINTING"},"laser":{title:"LASER GUN PRINTING"},"embroidery":{title:"EMBROIDERY"}};

  return (
    <div className={styles.Container}>
      <div style={{backgroundColor: "#000000"}} className={styles.DetailTitleBox}>
        <p>{location.state && location.state.category && ORDER_STATE[location.state.category] ? ORDER_STATE[location.state.category].title  : "에셋 등록"}</p>
        <img src={IconBack} alt="뒤로가기" onClick={()=>{LinkClick(-1)}}/>
      </div>

      <div className={styles.DetailWrap}>
        <div className={styles.DetailImgWrap}> 
          <p className={styles.DetailTitle}>작업영역 보드</p>
          <div className={styles.Imgbox}>
            <img src={imageSrc} alt="" />
            <input hidden type="file" id="filepic" onChange={e=>encodeFileToBase64(e.target.files[0])}/>
            <label htmlFor="filepic">이미지 등록</label>
            {/* <input type={"file"} title="이미지 등록"></input>
            <button >이미지 등록</button> */}
          </div>
        </div>

        <div className={styles.DetailInfoWrap}>
          <div className={styles.DetailInfoInner}>
            <div className={styles.DetailInfoBox}>
              <p className={styles.DetailTitle}>옵션 정보</p>
              <div className={styles.InfoContent}>
                <div className={styles.InputRow}>
                  <p>NAME :</p>
                  <input type="text" value={productDetail.name} placeholder="0000후드" name="name" onChange={onUpdateDetail}/>
                </div>
                <div className={styles.InputRow}>
                  <p>PRICE :</p>
                  <input type="text" value={productDetail.price.toString()} placeholder="000dfefsadf00" name="price" onChange={onUpdateDetail}/>
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
              <Button title="SAVE" link={onInsertAssets}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmbroideryEditContent;
