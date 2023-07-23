import { useState, useEffect } from "react";

// img
import ProductImg1 from 'resources/image/product_img1.png'
import ProductImg2 from 'resources/image/product_img2.png'

const useProductListStateA = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const init = () => {
      setList([
        {
          id:1004,
          code: "2fdsf02300",
          size: "S,M,L",
          color: "블랙,화이트",
          date:"00.00.00",
          work: [1,2],
          phone:"010-0000-0000",
          price:12000, 
          src: ProductImg1
        },
        {
          id:1005,
          code: "2fdsf02300",
          size: "",
          color: "",
          date:"00.00.00",
          work: [0],
          phone:"010-0000-0000",
          price:10000,
          src: ProductImg2
        }
      ]);
    };
    
    if(list.length == 0)
      init();

  },[]);

  return list;
};

export default useProductListStateA;