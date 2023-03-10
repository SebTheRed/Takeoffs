import {useState, useEffect, useRef } from "react"
import './ObjectTiles.css'

const DoorStamp = ({selectedArrayStamps, chosenBlueprintScale, doorType, doorX, doorY, doorShape, doorColor, index, canvasDims, stampClickHandler, selectedDoorStampIndex}) => {

  const [doorStampColor, setDoorStampColor] = useState(doorColor)
  const [doorStampShape, setDoorStampShape] = useState(doorShape)
  const [doorStampDims, setDoorStampDims] = useState({x: 0, y: 0})
  const [doorStampSize, setDoorStampSize] = useState({pixel: '1px', number: 1})

  useEffect(() => {
    
  }, [])
  useEffect(() =>{
    let aspectRatio = (canvasDims[0] / canvasDims[1])
    let scaledSquareSize = ((canvasDims[1] * 0.12) * chosenBlueprintScale)
    let pixelString = scaledSquareSize + 'px'
    // console.log(pixelString)

    setDoorStampSize({
      pixel: pixelString,
      number: scaledSquareSize,
    })
  setDoorStampDims({
    x: doorX - (scaledSquareSize / 2),
    y: doorY - (scaledSquareSize / 2)
  })
   
  }, [canvasDims])

const stampClickFunc = (e) => {
  // if (e.shiftKey) {
    stampClickHandler(index)

  // }
  
  
}
  



  if (doorStampColor && doorStampShape) {
    if (selectedDoorStampIndex == index || selectedArrayStamps.includes(index)) {
      if (doorStampShape == 'circle') {
        return(
          <div
          onClick={stampClickFunc}
          className="door-box circle selected" style={{
            backgroundColor: doorColor,
            left: doorStampDims.x,
            top: doorStampDims.y,
            width: doorStampSize.pixel,
            height: doorStampSize.pixel,
            }}></div>
        )
      } else if (doorStampShape == 'square') {
        return(
          <div 
          onClick={stampClickFunc}
          className="door-box square selected" style={{
            backgroundColor: doorStampColor,
            left: doorStampDims.x,
            top: doorStampDims.y,
            width: doorStampSize.pixel,
            height: doorStampSize.pixel,
          }}></div>
        )
      }
    } else {
      if (doorStampShape == 'circle') {
        return(
          <div
          onClick={stampClickFunc}
          className="door-box circle" style={{
            backgroundColor: doorColor,
            left: doorStampDims.x,
            top: doorStampDims.y,
            width: doorStampSize.pixel,
            height: doorStampSize.pixel,
            }}></div>
        )
      } else if (doorStampShape == 'square') {
        return(
          <div
          onClick={stampClickFunc}
          className="door-box square" style={{
            backgroundColor: doorStampColor,
            left: doorStampDims.x,
            top: doorStampDims.y,
            width: doorStampSize.pixel,
            height: doorStampSize.pixel,
          }}></div>
        )
      }
    }
    
  } else {
    return (
      <div>Loading..</div>
    )
  }
  

}

export default DoorStamp