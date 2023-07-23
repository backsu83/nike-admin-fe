import { useState, useEffect,useRef } from "react";
import API from 'api';

const useOptions = (id) => {

  const optionRef = useRef();
  const [productId, setProductId] = useState(null);
  const [optionList, setOptionList] = useState([]);
  const [isAddOption, setIsAddOption] = useState(false);
  const [optionInfo, setOptionInfo] = useState({
    color:"",
    size:"",
    price:"",
  });

  useEffect(()=>{
    setProductId(id);
    refreshOptions(id);
  },[id]);

  const openEditOption = (value) => {

    if(productId === null){
      alert("상품 등록 후 이용 가능합니다.");
      return;
    }

    let detail = JSON.parse(JSON.stringify(value));
    detail.color = { color : detail.color , title : detail.color};
    detail.isEdit = true;
    setOptionList(list => {  list.map((v)=>{ v.isEdit = v.id == value.id; }); return [...list];})
    setOptionInfo(detail);
    if(!detail.id){
      setIsAddOption(true);
      optionRef.current.scrollTo(0,0)
    }else{
      setIsAddOption(false);
    }

  }

  const refreshOptions = async (id) => {
    let products = await API.getProducts();
    let product = products.product_list.filter(v=>v.id === ( id ? id : productId) )[0];
    if(product){
      setOptionList([...product.options]);
      setOptionInfo({color:"",size:"",price:""});
    }
  }

  const getImageSrc = async (fileParam) => {
    const file = new File([fileParam], new Date().getTime() + ".png");
    const formData = new FormData();
    formData.append("images", file);
    return await (await API.uploadImage(formData)).json();
  }

  const insertOptionEvent = async (value) => {

    if(productId === null){
      alert("상품 등록 후 이용 가능합니다.");
      return;
    }
    if(!optionInfo.id && (!optionInfo.img_file || !optionInfo.img_back_file)){
      alert("옵션 이미지 두장을 등록 후 이용 가능합니다.");
      return;
    }

    let option = {
      img : optionInfo.img,
      img_back : optionInfo.img_back,
    }

    if(optionInfo.img_file)
      option.img = "" + (await getImageSrc(optionInfo.img_file)).img;
    if(optionInfo.img_back_file)
      option.img_back = "" + (await getImageSrc(optionInfo.img_back_file)).img;

    let response = null;

    if(optionInfo.id){
      response = await API.putOption(
        optionInfo.id,
        optionInfo.size === "없음" ? " " : optionInfo.size,
        optionInfo.price ? optionInfo.price.toString() : "0",
        optionInfo.color.title === "없음" ? " " : optionInfo.color.color,
        option.img,
        option.img_back,
        productId,
        optionInfo.assets
      );
    }else{
      response = await API.postOption(
        optionInfo.size === "없음" ? " " : optionInfo.size,
        optionInfo.price ? optionInfo.price.toString() : "0",
        optionInfo.color.title === "없음" ? " " : optionInfo.color.color,
        option.img,
        option.img_back,
        productId,
        optionInfo.assets
      );
    }

    alert("적용 완료되었습니다.");
    refreshOptions();
    setIsAddOption(false);
  }

  const deleteOptionEvent = async (id) => {

    if(productId === null){
      alert("상품 등록 후 이용 가능합니다.");
      return;
    }

    let option = {
      id : id,
    }
    await API.deleteOption(option);
    refreshOptions();
  }

  const updateOptionEvent = async (value) => {

    if(productId === null){
      alert("상품 등록 후 이용 가능합니다.");
      return;
    }

    let option = {
      id : value.id,
      size : value.size,
      color: value.color,
      price : value.price,
      product_id:productId,
      img : value.img,
      img_back : value.img_back,
    }
    API.updateOption({option:option});
  }

  const saveImageToOptionDetail = (file,name) => {

    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve) => {
      reader.onload = () => {
        setOptionInfo(option => {
          option["img"] = reader.result;
          option[name] = file;
          return {...option};
        })
        resolve();
      };
    });

  }

  const onChangeOptionImages = (event) => {
    let target = event.nativeEvent.target;
    saveImageToOptionDetail(target.files[1],"img_back_file");
    saveImageToOptionDetail(target.files[0],"img_file");
  }

  return {
    optionRef,
    onChangeOptionImages,
    openEditOption,
    isAddOption,
    setIsAddOption,
    optionList,
    setProductId,
    setOptionList,
    optionInfo,
    setOptionInfo,
    insertOptionEvent,
    deleteOptionEvent,
    updateOptionEvent,
    refreshOptions
  }
};

export default useOptions;
