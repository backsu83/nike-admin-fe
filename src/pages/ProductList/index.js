import React from "react";
import { useNavigate } from 'react-router-dom';
import { Header,BorderLayoutBox,ProductListContent } from "components";
import styles from './style.module.scss';

import useProductList from "hooks/useProductList";
import useAssetList from "hooks/useAssetList";

function ProductListPage() {

  const [list] = useProductList();
  const [assetList] = useAssetList();
  const navigate = useNavigate()
  const LinkClick = () => {
    return navigate('/menu');
  } 

  return ( 
    <div className={styles.Container}>
      <Header/>

      <div className={styles.BoxWrap}>
        <BorderLayoutBox>
          <ProductListContent list={list} assetList={assetList}/>
        </BorderLayoutBox>
      </div>
    </div>
  );
}

export default ProductListPage;
