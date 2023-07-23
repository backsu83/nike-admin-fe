import { useState, useEffect } from "react";

const useListState = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const init = () => {
      setList([
        {
          "name": "tttt",
          "phone": "010-1234-1234",
          "is_agreed": true,
          "fabric_json": "asdfasdf",
          "option_id": 1,
          "assets": [
            {
              "asset_list": null
            }
          ],
          "category": "print",
          "img": "test",
          "img_back": null
        },
        {
          "name": "tttt",
          "phone": "010-1234-1234",
          "is_agreed": true,
          "fabric_json": "asdfasdf",
          "option_id": 1,
          "assets": [
            {
              "asset_list": null
            }
          ],
          "category": "print",
          "img": "test",
          "img_back": null
        },
        
      ]);
    };
    
    if(list.length == 0)
      init();

  },[]);

  return list;
};

export default useListState;