import React, {useEffect, useState} from "react";
import {useNavigate, useParams, useLocation} from 'react-router-dom';
import styles from './style.module.scss'
import {Button} from "components";

// img
import IconBack from 'resources/icon/icon_back.svg'
import API from "api";
import useProductList from "hooks/useProductList";

function OrderDetailContent() {
    const navigate = useNavigate();
    const {type} = useParams();
    const location = useLocation();
    const state = location.state;
    const [productInfo, setProductInfo] = useState(null);
    const [optionInfo, setOptionInfo] = useState(null);
    const [optionMap, setOptionMap] = useState({});
    const [isFront, setIsFront] = useState(true);
    const [products] = useProductList();
    const [messageImage,setMessageImage] = useState(null);
    const [message,setMessage] = useState("");
    const [imagePath,setImagePath] = useState(null);

    useEffect(() => {
        let objectMap = {};
        products.map((value) => {
            value.options && value.options.map((v) => {
                objectMap[v.id] = {option: v, product: value};
            })
        })
        setOptionMap(objectMap);
    }, [products])

    useEffect(() => {
        loadOption();
    }, []);

    const loadOption = async () => {
        let options = await API.getOptions();
        let products = await API.getProducts();
        if (products.product_list && options && options.option_list) {
            products.product_list.map((value) => {
                let option = value.options.filter(v => v.id === state.option_id);
                if (option.length != 0) {
                    setProductInfo(value);
                    setOptionInfo(option[0]);
                }
            })
        }
    }

    const LinkClick = (path) => {
        return navigate(path);
    }

    const activeStyle = (type) => {
        const ORDER_STATE = {
            "QR": {color: "#2266AB"},
            "print": {color: "#22AB2E"},
            "embroidery": {color: "#5C22AB"},
            "laser": {color: "#AB3222"}
        };
        return ORDER_STATE[type] ? ORDER_STATE[type].color : "#2266AB";
    }
    const detailTitle = () => {
        const ORDER_STATE = {
            "QR": {title: "PHOTO SCAN PRINTING"},
            "print": {title: "NBY DIGITAL PRINTING"},
            "laser": {title: "LASER GUN PRINTING"},
            "embroidery": {title: "EMBROIDERY"}
        };
        const category = location.state.category;
        switch (location.state.status) {
            case "order" :
                return ORDER_STATE[category].title + "  " + "작업대기";
            case "paid" :
                return ORDER_STATE[category].title + "  " + "결제완료";
            case "wip" :
                return ORDER_STATE[category].title + "  " + "작업중";
            case "done" :
                return ORDER_STATE[category].title + "  " + "픽업대기";
            case "taken" :
                return ORDER_STATE[category].title + "  " + "완료";
            case "cancel" :
                return ORDER_STATE[category].title + "  " + "주문 취소";
            default :
                return ORDER_STATE[category].title + "  " + "확인 필요";
        }
    }

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    }

    const onDownloadImage = () => {
        var image = new Image();
        image.crossOrigin = "anonymous";
        console.log(state)
        image.src = state[isFront ? "work_img" : "work_img_back"] && state[isFront ? "work_img" : "work_img_back"];
        var fileName = image.src.split("/").pop();
        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            canvas.getContext('2d').drawImage(this, 0, 0);
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                window.navigator.msSaveBlob(dataURLtoBlob(canvas.toDataURL()), fileName);
            } else {
                var link = document.createElement('a');
                link.href = canvas.toDataURL();
                link.download = fileName;
                link.click();
            }
        };
        image.onerror = function () {
            alert("이미지 다운을 할 수 없습니다.");
        }
    }

    async function doNextEvent(status) {

        const statusMap = {order: "paid", paid: "wip", wip: "done", done: "taken", cancel: "order", taken: "taken"};


        // if((status ? statusMap[status] : statusMap[state.status]) === "taken"){
        //   alert("이미 픽업 완료된 주문 상태값입니다.");
        //   return;
        // }


        // try{
        //ip 등록 필요 및 현재 서버에서 호출 예정이라 임시처리 작업해두었습니다.
        //  if((status ? statusMap[status] : statusMap[state.status]) === "done")
        // API.postAligo(state.name,state.phone ? state.phone.replace(/-/gi,'') : null);
        // }catch(e){ console.log(e); }


        // return;
        console.log(status, state.status)
        await API.putOrder(
            state.id,
            true,
            {asset_list: state.assets},
            state.category,
            state.option_id,
            state.img,
            state.img_back,
            status || statusMap[state.status]
        );


        alert("반영 되었습니다. 리스트에서 확인해주세요");
        window.history.back();
    }

    function getTotalListPrice(list) {
        let price = 0;
        list.map((value) => {
            price += value.price;
        })
        return price;
    }

    function getOrderDate() {
        let date = new Date(state.modified_at.replace("T", " ").split(".")[0]);
        date.setHours(date.getHours() + 9);

        function zeroCheck(num) {
            return num < 10 ? "0" + num : num;
        }

        return date.getFullYear().toString().slice(2, 4) + "." + zeroCheck(date.getMonth() + 1) + "." + zeroCheck(date.getDate()) + " / "
            + (date.getHours() >= 12 ? "PM " : "AM ") + zeroCheck(date.getHours() >= 12 ? date.getHours() - 12 : date.getHours()) + ":" + zeroCheck(date.getMinutes());
    }

    const getTotalPrice = () => {

        let detail = JSON.parse(JSON.stringify(state));
        detail.price = ((optionMap[state.option_id] && optionMap[state.option_id].product ? optionMap[state.option_id].product.price : 0))
        const categoryPrice = {QR: 15000, print: 15000, embroidery: 3000, laser: 3000, laser_pre: 3000};
        let resultPrice = 0;

        if (detail.category === "embroidery") {
            resultPrice = (detail.price + ((optionMap[detail.option_id] && optionMap[detail.option_id].option ? optionMap[detail.option_id].option.price : 0)) + categoryPrice[detail.category]);
        } else if (detail.category === "laser" || state.category === "laser_pre") {
            resultPrice = detail.price + categoryPrice[detail.category];
        } else {
            resultPrice = (detail.price + ((optionMap[detail.option_id] && optionMap[detail.option_id].option ? optionMap[detail.option_id].option.price : 0))
                + ((detail.work_img ? 1 : 0) * categoryPrice[detail.category])
                + ((detail.work_img_back ? 1 : 0) * categoryPrice[detail.category])
            )
        }

        return resultPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    }



    const encodeFileToBase64 = (fileBlob) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileBlob);
        setMessageImage(fileBlob);
        return new Promise((resolve) => {
        reader.onload = () => {
            
            resolve();
        };
        });
    };


    const getImageSrc = async (fileParam) => {
        const file = new File([fileParam], new Date().getTime() + ".png");
        const formData = new FormData();
        formData.append("images", file);
        let image =  await (await API.uploadImage(formData)).json();
        setImagePath(image);
        return await image.img;
    }
    
    async function sendMessage(){

        let currentModifyDate = new Date(state.modified_at.split(".")[0].replace(/-/gi,'/').replace(/T/gi,' '));
        currentModifyDate.setHours(currentModifyDate.getHours() + 33);
        
        let currentDate = new Date();

        if(currentDate.getTime() >= currentModifyDate.getTime()){
            alert("개인정보가 만료되었습니다.");
            return;
        }

        let img = null;
        
        if(messageImage){
        img = await getImageSrc(messageImage);
        }
        
        let result =  await API.postMessage(state.id,message,img);
        if(result.result == true){
        alert("전송되었습니다.");
        }
    }

    return (
        <div className={styles.Container}>
            <div style={{backgroundColor: activeStyle(state.category)}} className={styles.DetailTitleBox}>
                <p style={{color: "black"}}>{detailTitle()}</p>
                <img src={IconBack} alt="뒤로가기" onClick={() => {
                    LinkClick(-1)
                }}/>
            </div>

            <div className={styles.DetailWrap}>
                <div className={styles.DetailImgWrap}>
                    <p className={styles.DetailTitle}>작업 이미지</p>
                    <div className={styles.Imgbox}>
                        <div className={styles.FrontBtn}>
                            <a className={isFront === true && styles.Active} onClick={() => {
                                setIsFront(true);
                            }}>F</a>
                            {
                                state.work_img_back &&
                                <a className={isFront === false && styles.Active} onClick={() => {
                                    setIsFront(false)
                                }}>B</a>
                            }
                        </div>
                        <img
                            src={state[isFront ? "img" : "img_back"] && state[isFront ? "img" : "img_back"][0] == "h" ? state[isFront ? "img" : "img_back"] : "" + state[isFront ? "img" : "img_back"]}
                            alt=""/>
                        <button onClick={onDownloadImage}>작업 이미지 다운로드</button>
                    </div>
                </div>

                <div className={styles.DetailInfoWrap}>
                    <div className={styles.DetailInfoBox}>
                        <p className={styles.DetailTitle}>주문자 정보</p>
                        <div className={styles.InfoContent}>
                            {/*<p>NAME : {state.name}</p>*/}
                            <p>PHONE : {state.phone}</p>
                        </div>
                    </div>
                    <div className={styles.DetailInfoBox}>
                        <p className={styles.DetailTitle}>주문 날짜</p>
                        <div className={styles.InfoContent}>
                            <p>{getOrderDate()}</p>
                        </div>
                    </div>
                    <div className={styles.DetailInfoFullBox}>
                        <p className={styles.DetailTitle}>주문 내용</p>
                        <div className={styles.InfoContent}>
                            <p>제품명 : <span>{productInfo && productInfo.name}</span></p>
                            <p>컬러 : <span><i
                                style={{backgroundColor: optionInfo && optionInfo.color}}></i> {optionInfo && optionInfo.color}</span>
                            </p>
                            <p>사이즈 : <span>{optionInfo && optionInfo.size}</span></p>
                            <p>가격 : <span>{optionInfo && optionInfo.price}원</span></p>
                        </div>
                    </div>
                    <div className={styles.DetailInfoBox}>
                        <p className={styles.DetailSubTitle}>포토 스캔
                            프린트<span>{getTotalListPrice(state.assets ? state.assets.filter(v => !v.custom_id) : [])}원</span>
                        </p>
                        <div className={styles.InfoContent}>
                            <div className={styles.OptionImgList}>
                                {
                                    state && state.assets &&
                                    state.assets.map((value) => {
                                        if (!value.custom_id)
                                            return (
                                                <div className={styles.OptionImgBox}>
                                                    <div className={styles.OptionImg}>
                                                        <img src={value.img} alt=""/>
                                                    </div>
                                                    <div>
                                                        {/* <p>SIZE : 00x00</p> */}
                                                        <p>{value.price}원</p>
                                                    </div>
                                                </div>
                                            )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles.DetailInfoBox}>
                        <p className={styles.DetailSubTitle}>커스텀
                            드로잉<span>{getTotalListPrice(state.assets ? state.assets.filter(v => v.custom_id) : [])}원</span>
                        </p>
                        <div className={styles.InfoContent}>
                            <div className={styles.OptionImgList}>
                                {
                                    state && state.assets &&
                                    state.assets.map((value) => {
                                        if (value.custom_id)
                                            return (
                                                <div className={styles.OptionImgBox}>
                                                    <div className={styles.OptionImg}>
                                                        <img src={value.img} alt=""/>
                                                    </div>
                                                    <div>
                                                        {/* <p>SIZE : 00x00</p> */}
                                                        <p>{value.price}원</p>
                                                    </div>
                                                </div>
                                            )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    <div className={styles.DetailInfoFullBox}  style={{paddingBottom:30}}>
                        <p className={styles.DetailTitle}>문자 전송</p>
                        <div className={styles.InfoContent} style={{paddingBottom:5}}>
                        <textarea value={message} onChange={(e)=>{ setMessage(e.nativeEvent.target.value); }} className={styles.Textarea}></textarea> 
                        <div className={styles.MessageBtnBox}>
                            <div className={styles.FileInputBox}>
                            <input type="file" id="filepic" onChange={e=>encodeFileToBase64(e.target.files[0])} accept="image/png, image/gif, image/jpeg" />
                            <label htmlFor="filepic">파일업로드</label>
                            </div>
                            <div className={styles.Button}>
                            <button onClick={sendMessage}>문자보내기</button>
                            </div>
                        </div>   
                        </div>
                        <p>첨부된 이미지 명 : {messageImage && messageImage.name}</p>
                    </div>

                    <div className={styles.PriceWrap}>
                        <p>총 결제 금액 : {getTotalPrice()}원</p>
                        <div>
                            <Button title="CANCEL" link={() => {
                                doNextEvent("cancel")
                            }}/>
                            <Button title="NEXT" link={() => {
                                doNextEvent()
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailContent;
