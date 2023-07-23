import { useState, useEffect } from "react";
import {getProducts} from 'api';

const useProductList = (type) => {
  const [list, setList] = useState([]);


  useEffect(()=>{
    getOrderList();
  },[type]);

  const getOrderList = async () => {
    let list = await getProducts();
    setList(list && list.product_list ? list.product_list : []);
  }


  return [list]
};

export default useProductList;