import { useState, useEffect, useRef } from "react"

const BaseStamp = ({selectedArraySticks, chosenBlueprintScale, baseStampClickHandler, selectedBaseStampIndex,
  canvasDims, baseType, baseShape, baseColor, baseX, baseY, index, direction}) => {

  const [baseStampColor, setBaseStampColor] = useState(baseColor)
  const [baseStampShape, setBaseStampShape] = useState(baseShape)
  const [baseDirection, setBaseDirection] = useState(direction)
  const [baseStampDims, setBaseStampDims] = useState({x: 0, y: 0})
  const [baseStampSize, setBaseStampSize] = useState({pixelLength: '1px',pixelWidth: '1px', numberLength: 1, numberWidth: 1})

  useEffect(() =>{
    let aspectRatio = (canvasDims[0] / canvasDims[1])
    let scaled16LineLength = ((canvasDims[1] * 0.5) * chosenBlueprintScale)
    let scaled16LineWidth = ((canvasDims[1] * 0.04) * chosenBlueprintScale)
    let pixelLengthString = scaled16LineLength + 'px'
    let pixelWidthString = scaled16LineWidth + 'px'
    // console.log(pixelString)

    setBaseStampSize({
      pixelLength: pixelLengthString,
      pixelWidth: pixelWidthString,
      numberLength: scaled16LineLength,
      numberWidth: scaled16LineWidth,
    })
  setBaseStampDims({
    xLong: baseX - (scaled16LineLength / 2),
    xShort: baseX - (scaled16LineWidth / 2),
    yLong: baseY - (scaled16LineLength / 2),
    yShort: baseY - (scaled16LineWidth / 2),
  })
   
  }, [canvasDims])

  const stampClickFunc = () => {
    baseStampClickHandler(index)
  }

  
if (baseStampColor && baseStampShape) {
  // console.log(selectedBaseStampIndex)
  if (selectedBaseStampIndex == index || selectedArraySticks.includes(index)) {
    if (baseDirection == 'horizontal') {
      return(
        <div
          onClick={stampClickFunc}
          className="base-line selected" style={{
            backgroundColor: baseColor,
            left: baseStampDims.xLong,
            top: baseStampDims.yShort,
            width: baseStampSize.pixelLength,
            height: baseStampSize.pixelWidth,
            }}>
        </div> 
      )
    } else if (baseDirection == 'vertical') {
      return(
        <div
          onClick={stampClickFunc}
          className="base-line selected" style={{
            backgroundColor: baseColor,
            left: baseStampDims.xShort,
            top: baseStampDims.yLong,
            width: baseStampSize.pixelWidth,
            height: baseStampSize.pixelLength,
            }}>
        </div> 
      )
    }
  } else {
    if (baseDirection == 'horizontal') {
      return(
        <div
          onClick={stampClickFunc}
          className="base-line" style={{
            backgroundColor: baseColor,
            left: baseStampDims.xLong,
            top: baseStampDims.yShort,
            width: baseStampSize.pixelLength,
            height: baseStampSize.pixelWidth,
            }}>
        </div> 
      )
    } else if (baseDirection == 'vertical') {
      return(
        <div
          onClick={stampClickFunc}
          className="base-line" style={{
            backgroundColor: baseColor,
            left: baseStampDims.xShort,
            top: baseStampDims.yLong,
            width: baseStampSize.pixelWidth,
            height: baseStampSize.pixelLength,
            }}>
        </div> 
      )
    }
}
} else {
  console.error('bingo')
}
  
}
export default BaseStamp