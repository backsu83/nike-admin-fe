import { useState, useEffect } from "react";

// img
import ProductImg1 from 'resources/image/product_logo_img1.png'


const useProductListStateC = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const init = () => {
      setList([
        {
          id:1004,
          date:"00.00.00",
          price:12000, 
          src: ProductImg1
        },
      ]);
    };
    
    if(list.length == 0)
      init();

  },[]);

  return list;
};

export default useProductListStateC;