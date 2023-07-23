import { useState, useEffect, useRef ,useCallback} from "react";
import {fabric} from 'fabric';  
import 'fabric-brush';

const useFabric = () => {

  const [penType,setPenType] = useState(1);
  const [color,setColor] = useState("black");
  const [width,setWidth] = useState(10);
  const fabricRef = useRef();

  function getNormalBrush(){
    return new fabric.PencilBrush(fabricRef.current);
  }
  function getCrayonBrush(){
    return new fabric.CustomSprayBrush(fabricRef.current);
  }
  function getCustomBrush(){
    return new fabric.CustomBrush(fabricRef.current);
  }

  function changePenType(type){

    if(type === "pen")
      fabricRef.current.freeDrawingBrush = getNormalBrush();
    else if(type === "spray"){
      fabricRef.current.freeDrawingBrush = getCrayonBrush();
    }else{
      fabricRef.current.freeDrawingBrush = getCustomBrush();
    }

    fabricRef.current.freeDrawingBrush.width = width;
    fabricRef.current.freeDrawingBrush.color = color;
  }

  function updatePenState(color,lineWidth){ 

    if(fabricRef && fabricRef.current){
      loadCanvas();

      fabricRef.current.isDrawingMode = true;
      fabricRef.current.freeDrawingBrush.width = parseInt(lineWidth, 10) || 0;
      fabricRef.current.freeDrawingBrush.color = color;
      setColor(color);
      setWidth(parseInt(lineWidth, 10) || 0);
    }
  }

  function addImage(image){
    fabricRef.current.isDrawingMode = false;
    var imgInstance = new fabric.Image(image, {
      left: 100,
      top: 100,
      angle: 0,
    });
    fabricRef.current.add(imgInstance);   
  }

  function saveCanvas(){
    let saveJSON = JSON.stringify(fabricRef.current);
    localStorage.setItem("fabricSaveData",saveJSON);
  }

  function loadCanvas(){
    let saveJSON = localStorage.getItem("fabricSaveData");
    fabricRef.current.loadFromJSON(saveJSON);
  }

  function selectDeleteEvent(){
    const obj = fabricRef.current.getActiveObject();
    fabricRef.current.remove(fabricRef.current.getActiveObject());
    fabricRef.current.renderAll(); 
  }
  
  function clearEvent(){
    var json = {};
    fabricRef.current.clear();
    fabricRef.current.loadFromJSON(json);
  }

  function changeDrawMode(isDraw){
    fabricRef.current.isDrawingMode = isDraw;
  }

  return { updatePenState,penType,setPenType,fabricRef,addImage,changePenType,clearEvent,selectDeleteEvent,changeDrawMode};
};

export default useFabric;