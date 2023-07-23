import { useState, useEffect } from "react";

const useProductListStateD = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const init = () => {
      setList([
        {
          type: 0,
          id:1004,
          price:10000, 
          date:"00.00.00",
        },
        {
          type: 1,
          id:1005,
          price:10000, 
          date:"00.00.00",
        }
      ]);
    };
    
    if(list.length == 0)
      init();

  },[]);

  return list;
};

export default useProductListStateD;