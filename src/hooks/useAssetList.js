import { useState, useEffect } from "react";
import {getAssets} from 'api';

const useAssetList = (type) => {
  const [list, setList] = useState([]); 


  useEffect(()=>{
    getOrderList();
  },[type]);

  const getOrderList = async () => {
    let list = await getAssets();
    setList(list && list.asset_list ? list.asset_list : []);
  }


  return [list,setList]
};

export default useAssetList;