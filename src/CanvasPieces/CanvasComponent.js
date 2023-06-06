import './CanvasStyles.css';
import {useEffect, useRef, useState} from 'react'



const CanvasComponent = ({transformValuesRef,findSelectedRange, updateDoorCountArray, canvasDims, typeCountUpdater, chosenItemType, processLineDraw}) => {
    //1inch == 96px
    //36 x 24 == 3456 x 2304
    // 24 x 18 == 2304 x 1726
    // 8.5 x 11 == 816 x 1056

    //lineDrawingCoords is a reference that is essential to locating mouse clicks. It is used entirely with the baseboard stamps.
    const lineDrawingCoords = useRef({
        firstX: 0, firstY: 0, secondX: 0, secondY: 0,
    })
    const lineDash = useRef([15, 15])
    //canvasReference specifically references the <canvas /> XML element.
    const canvasReference = useRef()

    //contextReference is used to call information about the canvas so we can draw on it. This will be removed.
    const contextReference = useRef()

    //mouseCanvasRealtimeCoords is explained in the name.
    const mouseCanvasRealtimeCoords = useRef()

    const selectionCoordsRef = useRef({
      firstX: 0,
      firstY: 0,
      secondX: 0,
      secondY: 0,
    })

    const animationLoopRef = useRef()

    //This useEffect actually links the canvas XML & the context reference.
    useEffect(() => {
        try {
        contextReference.current = canvasReference.current.getContext('2d')
        
    } catch(err) {console.log(err)}


    
    }, [])


    //Checks the mouse position in the whole DOM, then subtracts the bounding of the canvas to figure the XY of the mouse inside of the canvas.
    //Since the canvas 1:1 overlays the blueprints, the X Y of the mouse over the canvas is always the same as the X Y of the plans.
    //This function tracks the mouse coords on move, which I don't even think is necessary lol.
    const getCursorPosition =(e)=> {
      let rect = canvasReference.current.getBoundingClientRect();
      const tVals = transformValuesRef.current
      let xMouseActual = (e.clientX - rect.left) / tVals.scale;
      let yMouseActual = (e.clientY - rect.top) / tVals.scale;
        // console.log("x: " + xRealtime + " y: " + yRealtime)
        //Setting a reference so these coordinates can be called in real time, with no re-render.
        mouseCanvasRealtimeCoords.current = {x: xMouseActual, y: yMouseActual}
      }

//idk honestly
    const childProxyTypeCountUpdater = (val) => {
        typeCountUpdater(val)
    }

    //This func fires when the canvas is clicked.
    //It runs a switch to determine what the chosen button is, and fires the "drawing" functions of said stamp/stick.
    const canvasClickHandler = (e) => {
        // e.stopPropagation();
        let stampColor = ''

        //Below I am trying to establish realtime coordinates that work with react-zoom-pan-pinch.
        //I've passed transformValues from App.js, and use it here.
        let rect = canvasReference.current.getBoundingClientRect();
        const tVals = transformValuesRef.current
        let xMouseActual = (e.clientX - rect.left) / tVals.scale;
        let yMouseActual = (e.clientY - rect.top) / tVals.scale;


        //drawSquareClick fires based on the type of stamp, which is determined in the switch below.
        //First it gets the XY coords, same logic as getCursorPosition
        //Then it determines an aspect ratio, which I think is entirely unnecessary.
        //Then it sends the information to App, so it can be pushed into the stamp arrays!
        const drawSquareClick = (type) => {  
            // console.log(contextReference.current)
            // console.log(xMouseCoord, yMouseCoord)
            const aspectRatio = (canvasDims[0] / canvasDims[1])
            updateDoorCountArray(Math.floor(xMouseActual), Math.floor(yMouseActual), type, aspectRatio)
        }

        
        const drawLineClicks = () => {
            if (lineDrawingCoords.current.secondX != 0) {
                lineDrawingCoords.current = {firstX: 0, firstY: 0, secondX: 0, secondY: 0,}
                console.log('reset')
            } else if (lineDrawingCoords.current.firstX == 0) {
                let rect = canvasReference.current.getBoundingClientRect()
                let xMouseCoord = e.clientX - rect.left
                let yMouseCoord = e.clientY - rect.top
                lineDrawingCoords.current.firstX = xMouseCoord
                lineDrawingCoords.current.firstY = yMouseCoord
                console.log(lineDrawingCoords.current)

            }
            else if (lineDrawingCoords.current.firstX != 0) {
                let rect = canvasReference.current.getBoundingClientRect()
                let xMouseCoord2 = e.clientX - rect.left
                let yMouseCoord2 = e.clientY - rect.top
                lineDrawingCoords.current.secondX = xMouseCoord2
                lineDrawingCoords.current.secondY = yMouseCoord2
                console.log(lineDrawingCoords.current)
                contextReference.current.beginPath();
                contextReference.current.moveTo(lineDrawingCoords.current.firstX, lineDrawingCoords.current.firstY)
                contextReference.current.lineTo(mouseCanvasRealtimeCoords.current.x, mouseCanvasRealtimeCoords.current.y)
                contextReference.current.lineWidth = 5;
                contextReference.current.strokeStyle = '#ff0000'
                contextReference.current.stroke();
                const aspectRatio = (canvasDims[0] / canvasDims[1])

                let xCoordDiff = lineDrawingCoords.current.secondX - lineDrawingCoords.current.firstX;
                let yCoordDiff = lineDrawingCoords.current.secondY - lineDrawingCoords.current.firstY;
                let distanceCalc = Math.sqrt(xCoordDiff * xCoordDiff + yCoordDiff * yCoordDiff);
                console.log(distanceCalc)
                processLineDraw(distanceCalc)

            } else {console.error('idk')}

        }
        
        //drawLine16Horizontal fires based on the type of stamp, which is determined in the switch below.
        const drawLine16Horizontal = () => {
            let rect = canvasReference.current.getBoundingClientRect()
            let xMouseCoord1 = e.clientX - rect.left
            let yMouseCoord1 = e.clientY - rect.top
            lineDrawingCoords.current.firstX = xMouseCoord1
            lineDrawingCoords.current.firstY = yMouseCoord1
            console.log(lineDrawingCoords.current)
            processLineDraw(Math.floor(xMouseActual), Math.floor(yMouseActual), 16, 'horizontal', 'baseBoard16')
        }
        //drawLine16Vertical fires based on the type of stamp, which is determined in the switch below.
        const drawLine16Vertical = () => {
            let rect = canvasReference.current.getBoundingClientRect()
            let xMouseCoord1 = e.clientX - rect.left
            let yMouseCoord1 = e.clientY - rect.top
            lineDrawingCoords.current.firstX = xMouseCoord1
            lineDrawingCoords.current.firstY = yMouseCoord1
            console.log(lineDrawingCoords.current)
            processLineDraw(Math.floor(xMouseActual), Math.floor(yMouseActual), 16, 'vertical', 'baseBoard16')
        }

        //This switch checks what button is selected, and "draws" the shape accordingly, using the functions above.
        switch(chosenItemType) {
            
            case 'entryDoorsButton':
                childProxyTypeCountUpdater('entryDoor')
                stampColor = 'rgba(255, 0, 0, 0.4)'
                drawSquareClick('entryDoor')
            break;
            case 'privacyDoorsButton':
                childProxyTypeCountUpdater('privacyDoor')
                stampColor = 'rgba(255, 251, 0, 0.4)'
                drawSquareClick('privacyDoor')
            break;
            case 'passageDoorsButton':
                childProxyTypeCountUpdater('passageDoor')
                stampColor = 'rgba(136, 255, 0, 0.4)'
                drawSquareClick('passageDoor')
            break;
            case 'twinPassageDoorsButton':
                childProxyTypeCountUpdater('twinPassageDoor')
                stampColor = 'rgba(38, 255, 0, 0.4)'
                drawSquareClick('twinPassageDoor')
            break;
            case 'slidingDoorsButton':
                childProxyTypeCountUpdater('slidingDoor')
                stampColor = 'rgba(0, 255, 68, 0.4)'
                drawSquareClick('slidingDoor')
            break;
            case 'louverDoorsButton':
                childProxyTypeCountUpdater('louverDoor')
                stampColor = 'rgba(255, 174, 0, 0.4)'
                drawSquareClick('louverDoor')
            break;
            case 'steelDoorsButton':
                childProxyTypeCountUpdater('commercialDoor')
                stampColor = 'rgba(255, 0, 221, 0.4)'
                drawSquareClick('commercialDoor')
            break;
            case 'twinSteelDoorsButton':
                childProxyTypeCountUpdater('twinCommercialDoor')
                stampColor = 'rgba(221, 0, 255, 0.4)'
                drawSquareClick('twinCommercialDoor')
            break;
            case 'steelLiteDoorsButton':
                childProxyTypeCountUpdater('stairDoor')
                stampColor = 'rgba(255, 0, 149, 0.4)'
                drawSquareClick('stairDoor')
            break;
            case 'heavyFireDoorsButton':
                childProxyTypeCountUpdater('heavyFireDoor')
                stampColor = 'rgba(255, 0, 76, 0.4)'
                drawSquareClick('heavyFireDoor')
            break;
            case 'threeFootWindowsButton':
                childProxyTypeCountUpdater('windowsThreeFT')
                stampColor = 'rgba(0, 255, 255, 0.4)'
                drawSquareClick('windowsThreeFT')
            break;
            case 'sixFootWindowsButton':
                childProxyTypeCountUpdater('windowsSixFT')
                stampColor = 'rgba(0, 195, 255, 0.4)'
                drawSquareClick('windowsSixFT')
            break;
            case 'nineFootWindowsButton':
                childProxyTypeCountUpdater('windowsNineFt')
                stampColor = 'rgba(0, 140, 255, 0.4)'
                drawSquareClick('windowsNineFt')
            break;
            case 'patioCasingButton':
                childProxyTypeCountUpdater('patioCasing')
                stampColor = 'rgba(0, 255, 191, 0.4)'
                drawSquareClick('patioCasing')
            break;
            case 'twinLouverButton':
                childProxyTypeCountUpdater('twinLouvers')
                stampColor = 'rgba(255, 191, 0, 0.4)'
                drawSquareClick('twinLouvers')
            break;
            case 'twinSliderButton':
                childProxyTypeCountUpdater('twinSliders')
                stampColor = 'rgba(0, 255, 95, 0.4)'
                drawSquareClick('twinSliders')
            break;
            case 'pocketDoorButton':
                childProxyTypeCountUpdater('pocketDoors')
                stampColor = 'rgba(154, 0, 255, 0.4)'
                drawSquareClick('pocketDoors')
            break;
            case 'twinHeavyFireDoorButton':
                childProxyTypeCountUpdater('twinHeavyFireDoors')
                stampColor = 'rgba(255, 0, 60, 0.4)'
                drawSquareClick('twinHeavyFireDoors')
            break;
            case 'twinStairDoorButton':
                childProxyTypeCountUpdater('twinStairDoors')
                stampColor = 'rgba(255, 0, 155, 0.4)'
                drawSquareClick('twinStairDoors')
            break;
            case 'baseBoardButton':
                //THIS ISN'T BEING USED AT THE MOMENT!!!
                drawLineClicks();
                stampColor = 'rgba(122, 178, 25, 0.4)'
            break;
            case 'baseBoardVerticalButton':
              childProxyTypeCountUpdater('vertical16')
                drawLine16Vertical()
                stampColor = 'rgba(122, 178, 25, 0.4)'
            break;
            case 'baseBoardHorizontalButton':
              childProxyTypeCountUpdater('horizontal16')
                drawLine16Horizontal()
                stampColor = 'rgba(122, 178, 25, 0.4)'
            break;
            case 'selectionToolButton':
              let rect = canvasReference.current.getBoundingClientRect();
              const tVals = transformValuesRef.current
              let xMouseActual = (e.clientX - rect.left) / tVals.scale;
              let yMouseActual = (e.clientY - rect.top) / tVals.scale;
              selectionCoordsRef.current.secondX = xMouseActual
              selectionCoordsRef.current.secondY = yMouseActual
              // console.table(selectionCoordsRef.current)


              let firstX = +selectionCoordsRef.current.firstX
              let secondX = +selectionCoordsRef.current.secondX
              let firstY = +selectionCoordsRef.current.firstY
              let secondY = +selectionCoordsRef.current.secondY

              let smallX = 0
              let smallY = 0
              let bigX = 0
              let bigY = 0


              if (firstX < secondX) {
                smallX = firstX;
                bigX = secondX;
              } else if (firstX > secondX) {
                smallX = secondX
                bigX = firstX
              }
              if (firstY < secondY) {
                smallY = firstY
                bigY = secondY
              } else if (firstY > secondY) {
                smallY = secondY
                bigY = firstY
              }
              findSelectedRange(smallX, smallY, bigX, bigY)
              break;
        }
        
        
    }


    //This func will run when the mouse is released from a click.
    const mouseUpHandler =(e) => {
      cancelAnimationFrame(animationLoopRef.current)
      animationLoopRef.current = ''
      canvasReference.current.classList.remove('dragging')
    }
    const mouseLeaveHandler = (e) => {
      canvasReference.current.classList.remove('dragging')
      cancelAnimationFrame(animationLoopRef.current)
      animationLoopRef.current = ''
    }

    const mouseDownHandler = (e) => {
      if (chosenItemType == 'selectionToolButton') {
        canvasReference.current.classList.add('dragging')
      if (e.button == 2){return}else if(e.button==1){
        
        return
      }
      let rect = canvasReference.current.getBoundingClientRect();
      const tVals = transformValuesRef.current
      let xMouseActual = (e.clientX - rect.left) / tVals.scale;
      let yMouseActual = (e.clientY - rect.top) / tVals.scale;
      selectionCoordsRef.current.firstX = xMouseActual
      selectionCoordsRef.current.firstY = yMouseActual
      selectionBoxAnimate();
      // console.log('START: ',xMouseCoord, yMouseCoord)
      }
      
      
    }


    const selectionBoxAnimate = () => {
      contextReference.current.clearRect(0, 0, canvasDims[0], canvasDims[1])
      let firstX = selectionCoordsRef.current.firstX
      let firstY = selectionCoordsRef.current.firstY
      contextReference.current.lineWidth = 10;
      contextReference.current.strokeStyle = '#7b7b7b'
      contextReference.current.beginPath();
      contextReference.current.setLineDash(lineDash.current)
      const horizontalDist = (mouseCanvasRealtimeCoords.current.x - firstX)
      const verticalDist = (mouseCanvasRealtimeCoords.current.y - firstY)
      contextReference.current.rect(firstX, firstY, horizontalDist, verticalDist)
      // contextReference.current.moveTo(firstX, firstY);
      // contextReference.current.lineTo(mouseCanvasRealtimeCoords.current.x, mouseCanvasRealtimeCoords.current.y);
      contextReference.current.stroke();
      animationLoopRef.current = requestAnimationFrame(selectionBoxAnimate);
    }

    const rightCLickHandler = (e) => {
      e.preventDefault()
    }

    return(
        //Need I say more?
            <canvas 
            width={canvasDims[0]} 
            height={canvasDims[1]} 
            ref={canvasReference} 
            onContextMenu={rightCLickHandler} 
            onMouseMove={getCursorPosition} 
            onClick={canvasClickHandler} 
            onMouseUp={mouseUpHandler} 
            onMouseDown={mouseDownHandler} 
            onMouseOut={mouseLeaveHandler}
            id="canvas" />
    
    )
}
export default CanvasComponent




// contextReference.current.beginPath();
            // contextReference.current.moveTo(lineDrawingCoords.current.firstX, lineDrawingCoords.current.firstY)
            // // contextReference.current.lineTo(+lineDrawingCoords.current.firstX - 200, +lineDrawingCoords.current.firstY)
            // contextReference.current.lineTo(+lineDrawingCoords.current.firstX + distanceVar, +lineDrawingCoords.current.firstY)
            // contextReference.current.lineWidth = 5;
            // contextReference.current.strokeStyle = '#ff0000'
            // contextReference.current.stroke();