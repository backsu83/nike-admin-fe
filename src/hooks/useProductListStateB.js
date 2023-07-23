import { useState, useEffect } from "react";

// img
import ProductImg1 from 'resources/image/product_logo_img1.png'
import ProductImg2 from 'resources/image/product_logo_img2.png'
import ProductImg3 from 'resources/image/product_logo_img3.png'

const useProductListStateB = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const init = () => {
      setList([
        {
          id:1004,
          date:"00.00.00",
          work: [1,2],
          price:12000, 
          src: ProductImg1
        },
        {
          id:1005,
          date:"00.00.00",
          work: [0],
          price:10000,
          src: ProductImg2
        },
        {
          id:1005,
          date:"00.00.00",
          work: [0],
          price:10000,
          src: ProductImg3
        }
      ]);
    };
    
    if(list.length == 0)
      init();

  },[]);

  return list;
};

export default useProductListStateB;