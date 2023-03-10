import { useState, useEffect, useRef } from 'react';
import './App.css';
import BluePrintBackground from './Blueprints/BluePrintBackground';
import CanvasComponent from './CanvasPieces/CanvasComponent';
import DoorStamp from './ObjectTiles/DoorStamp';
import BaseStamp from './ObjectTiles/BaseStamp';
import HeaderBar from './HeaderBar';

// :)
//V1 Complete 2/23/2023
function App() {


  /* --HOOKS-- */

  const [baseUrl, setBaseUrl] = useState('https://amp-server-ltmvs7f3fa-ue.a.run.app/')
  // const [baseUrl, setBaseUrl] = useState('http://localhost:1396/')
  const [postPoint, setPostPoint] = useState('PostMeridiaPompton/')
  const [getPoint, setGetPoint] = useState('GetMeridiaPompton/')

  //countsState keeps track of the current quantities of stamps created/deleted
  const [countsState, setCountsState] = useState({
    entryDoors: 0,
    privacyDoors: 0,
    passageDoors: 0,
    twinPassageDoors: 0,
    slidingDoors: 0,
    louverDoors: 0,
    commercialDoors: 0,
    twinCommercialDoors: 0,
    stairDoors: 0,
    heavyFireDoors: 0,
    windowsThreeFT: 0,
    windowsSixFT: 0,
    windowsNineFt: 0,
    patioCasings: 0,
    baseBoard16: 0,
    baseBoard8: 0,
    twinLouvers: 0,
    twinSliders: 0,
    pocketDoors: 0,
    twinHeavyFireDoors: 0,
    twinStairDoors: 0,
  })
  //both of the "all" count arrays are used to store the entire collection of stamps/sticks
  const [allDoorCountArray, setAllDoorCountArray] = useState([])
  const [allBaseCountArray, setAllBaseCountArray] = useState([])
  //Simple container to hold the info sheet from the API
  const [takeOffInfo, setTakeOffInfo] = useState([])
  //This determines what the status of a save is. Can be 'SAVED' 'SAVING' or 'FAILED', which the server will spit back if the save fails.
  const [saveStatus, setSaveStatus] = useState('SAVED')
  //doorCountArray holds the array of stamps for each unique sheet, and re-renders on page change or new stamp.
  const [doorCountArray, setDoorCountArray] = useState([]) 
  //baseCountArray hosts an array of objects. Each object represents a baseboard stamp.
  const [baseCountArray, setBaseCountArray] = useState([])
  //pageCountArray holds the array of page ID's from google drive. Using these ID's I can call the background images.
  const [pageCountArray, setPageCountArray] = useState([])
  //chosenBlueprintScale holds the chosen scale value by the user. This math will be more heavily implemented later when true scaling comes about.
  const [chosenBlueprintScale, setChosenBlueprintScale] = useState(0.25)
  //chosenPageIndex is an integer that changes based on the pagination of the user.
  const [chosenPageIndex, setChosenPageIndex] = useState(0)
  //canvasDims change when the image loads. These dims are used to scale certain shapes on the page to ensure they're the right size.
  const [canvasDims, setCanvasDims] = useState(['1000px', '1000px'])
  //chosenItemType is used to pass between the header & canvas to determine what is being pressed.
  const [chosenItemType, setChosenItemType] = useState('selectionToolButton')
  //loginAuth not implemented yet.
  const [loginAuth, setLoginAuth] = useState('failure')
  //darkMode is self explainatory
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkOrLight'))
  //selectedDoorStampIndex is an integer that reflect what the index is of the chosen door stamp in the svg-frame. Same as base counterpart.
  const [selectedDoorStampIndex, setSelectedDoorStampIndex] = useState()
  const [selectedBaseStampIndex, setSelectedBaseStampIndex] = useState(NaN)

  const [selectedArrayStamps, setSelectedArrayStamps] = useState([])
  const [selectedArraySticks, setSelectedArraySticks] = useState([])

  const [multiSelectToggle, setMultiSelectToggle] = useState(false)

  //backgroundImageRef references the img XML element in BluePrintBackground.js
  const backgroundImageRef = useRef()
  //bundledValueBucket is used to assemble data for posting to server.
  const bundledValueBucket = useRef()
  //the reference counterpart to chosenPageIndex. Useful for live-feeding methods&variables the page number. It's used everywhere lol.
  const chosenPageRef = useRef(0)
  //
  const defaultMultiplierValRef = useRef(1)
  


/* -- EFFECTS -- */

//WOAH..... the big one...
useEffect(() => {
  //pullData calls, manipulates, and sets all of the backend data to the front end.
  async function pullData() {
    const invoiceFetch = await fetch(baseUrl + getPoint, {
        method: 'GET'
    })
    .then(result => result.json())
    .then(data => {
      //setTakeOffInfo sets.. you know.. the takeoff info..
      setTakeOffInfo(data.info[1])
      //setting the saved scale. Usually defaults at 0.25
      setChosenBlueprintScale(data.info[1][4])
        console.log(data)
        const countsData = data.counts[1]
        //Turning an array of integers into a usable object.
        //Definitely do this more on my projects instead of using array[0]
        const countsObj = {
          entryDoors: countsData[0],
          privacyDoors: countsData[1],
          passageDoors: countsData[2],
          twinPassageDoors: countsData[3],
          slidingDoors: countsData[4],
          louverDoors: countsData[5],
          commercialDoors: countsData[6],
          twinCommercialDoors: countsData[7],
          stairDoors: countsData[8],
          heavyFireDoors: countsData[9],
          windowsThreeFT: countsData[10],
          windowsSixFT: countsData[11],
          windowsNineFt: countsData[12],
          patioCasings: countsData[13],
          baseBoard16: countsData[14],
          baseBoard8: countsData[15],
          twinLouvers: countsData[16],
          twinSliders: countsData[17],
          pocketDoors: countsData[18],
          twinHeavyFireDoors: countsData[19],
          twinStairDoors: countsData[20]
        }
        setCountsState(countsObj)
        const sticksData = data.sticks
        // console.log(sticksData)
        let passThruStickObj = {}
        let sticksObjs = []

        //This if>for>for first ensures there are sticks coming from the server.
        //second loops over the parent array
        //third loops over the child arrays, which are the individual strings of data.
        //fourth assigns every string to an object key/value pair.
        //fifth after one stick obj is assembled, it is pushed to the array of all sticks.
        //rinse wash repeat.
        if (sticksData) {
          for (let i = 0;i < sticksData.length; i++) {
            passThruStickObj = {}
            for (let j = 0; j < sticksData[i].length; j++) {
              passThruStickObj = {
                pageNum: sticksData[i][0],
                 xCoord: sticksData[i][1],
                  yCoord: sticksData[i][2],
                   type: sticksData[i][3],
                    shape: sticksData[i][4],
                     color: sticksData[i][5],
                      multiplier: sticksData[i][6],
                       length: sticksData[i][7],
                        direction: sticksData[i][8]
                }
            }
            sticksObjs.push(passThruStickObj)
          }
          //Note this is setting the ALL array.
          setAllBaseCountArray(sticksObjs)
          // console.log(sticksObjs)
          //The below map is used to check which sticks/stamps match the starting page number 0.
          //It then sets the matching sticks/stamps to their respective per-page countArray
          let allMatchingSticks = []
          sticksObjs.map(stickData => {
            if (+stickData.pageNum == 0) {
              allMatchingSticks.push(stickData)
            }})
          setBaseCountArray(allMatchingSticks)
        }
        const stampData = data.stamps
        // console.log(stampData)
        let passThruStampObj = {}
        let stampObjs = []

        //This if>for>for first ensures there are stamps coming from the server.
        //second loops over the parent array
        //third loops over the child arrays, which are the individual strings of data.
        //fourth assigns every string to an object key/value pair.
        //fifth after one stick obj is assembled, it is pushed to the array of all stamps.
        //rinse wash repeat.
        if (stampData) {
          for (let i = 0;i < stampData.length; i++) {
            passThruStampObj = {}
            for (let j = 0; j < stampData[i].length; j++) {
              passThruStampObj = {
                pageNum: stampData[i][0],
                 xCoord: stampData[i][1],
                  yCoord: stampData[i][2],
                   type: stampData[i][3],
                    shape: stampData[i][4],
                     color: stampData[i][5],
                      multiplier: stampData[i][6]
                }
            }
            stampObjs.push(passThruStampObj)
          }
          //Note this is setting the ALL array.
          setAllDoorCountArray(stampObjs)
          // console.log(stampObjs)
          //The below map is used to check which sticks/stamps match the starting page number 0.
          //It then sets the matching sticks/stamps to their respective per-page countArray
          let allMatchingStamps = []
          stampObjs.map(stampData => {
            if (+stampData.pageNum == 0) {
              allMatchingStamps.push(stampData)
            }
            // console.log(allMatchingStamps)
          setDoorCountArray(allMatchingStamps)
          })
        }
        
        //For some reason the list of plans come out of the backend in reverse-order.
        //So for obvious reasons I reverse the array, and set it to the state that contains the array of page info objs.
        let plansFlipped = [...data.plans].reverse()
        setPageCountArray(plansFlipped)
    });
    
  } 

  //Don't forget to run the huge async function that makes up this entire effect!!
  pullData()
}, [])



/* -- FUNCTIONS -- */
//"This is where the fun begins"





const handleMultiplierChanger = (e) => {

  

  let fauxBaseArray = [...baseCountArray]
  let fauxDoorArray = [...doorCountArray]
  let fauxAllBaseArray = [...allBaseCountArray]
  let fauxAllDoorArray = [...allDoorCountArray]
  let countedItemsCopy = {...countsState}

  console.log(+e.target.value)
  if (!isNaN(selectedDoorStampIndex)) {

    defaultMultiplierValRef.current = +e.target.value
    console.log()
    let matchingMultiplier = fauxDoorArray[selectedDoorStampIndex].multiplier
    fauxDoorArray[selectedDoorStampIndex].multiplier = +e.target.value
    console.log(matchingMultiplier)
    let differenceFromMatch = e.target.value - matchingMultiplier
    // console.log(differenceFromMatch)
      fauxAllDoorArray.map((door, index) => {
       if(fauxDoorArray[selectedDoorStampIndex].pageNum == door.pageNum && fauxDoorArray[selectedDoorStampIndex].xCoord == door.xCoord && fauxDoorArray[selectedDoorStampIndex].yCoord == door.yCoord)
       {
          fauxAllDoorArray[index].multiplier = +e.target.value
        }
      })
      //Setting the array & re-setting the selected index.
      setAllDoorCountArray(fauxAllDoorArray)
      setDoorCountArray(fauxDoorArray)

      if (countedItemsCopy == undefined) {console.error('ERROR APP.JS : countsState == undefined')}
      // console.log(fauxDoorArray[selectedDoorStampIndex].type)
      let addedCount = 0
      switch (fauxDoorArray[selectedDoorStampIndex].type) {
        case 'entryDoor' :
        addedCount = +countedItemsCopy.entryDoors + +differenceFromMatch
        countedItemsCopy.entryDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'privacyDoor' :
        addedCount = +countedItemsCopy.privacyDoors + +differenceFromMatch
        countedItemsCopy.privacyDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'passageDoor' :
        addedCount = +countedItemsCopy.passageDoors + +differenceFromMatch
        countedItemsCopy.passageDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'twinPassageDoor' :
        addedCount = +countedItemsCopy.twinPassageDoors + +differenceFromMatch
        countedItemsCopy.twinPassageDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'slidingDoor' :
        addedCount = +countedItemsCopy.slidingDoors + +differenceFromMatch
        countedItemsCopy.slidingDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'louverDoor' :
        addedCount = +countedItemsCopy.louverDoors + +differenceFromMatch
        countedItemsCopy.louverDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'commercialDoor' :
        addedCount = +countedItemsCopy.commercialDoors + +differenceFromMatch
        countedItemsCopy.commercialDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'twinCommercialDoor' :
        addedCount = +countedItemsCopy.twinCommercialDoors + +differenceFromMatch
        countedItemsCopy.twinCommercialDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'stairDoor' :
        addedCount = +countedItemsCopy.stairDoors + +differenceFromMatch
        countedItemsCopy.stairDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'heavyFireDoor' :
        addedCount = +countedItemsCopy.heavyFireDoors + +differenceFromMatch
        countedItemsCopy.heavyFireDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'windowsThreeFT' :
        addedCount = +countedItemsCopy.windowsThreeFT + +differenceFromMatch
        countedItemsCopy.windowsThreeFT = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'windowsSixFT' :
        addedCount = +countedItemsCopy.windowsSixFT + +differenceFromMatch
        countedItemsCopy.windowsSixFT = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'windowsNineFt' :
        addedCount = +countedItemsCopy.windowsNineFt + +differenceFromMatch
        countedItemsCopy.windowsNineFt = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'patioCasing' :
        addedCount = +countedItemsCopy.patioCasings + +differenceFromMatch
        countedItemsCopy.patioCasings = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'twinLouvers' :
        addedCount = +countedItemsCopy.twinLouvers + +differenceFromMatch
        countedItemsCopy.twinLouvers = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'twinSliders' :
        addedCount = +countedItemsCopy.twinSliders + +differenceFromMatch
        countedItemsCopy.twinSliders = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'pocketDoors' :
        addedCount = +countedItemsCopy.pocketDoors + +differenceFromMatch
        countedItemsCopy.pocketDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'twinHeavyFireDoors' :
        addedCount = +countedItemsCopy.twinHeavyFireDoors + +differenceFromMatch
        countedItemsCopy.twinHeavyFireDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'twinStairDoors' :
        addedCount = +countedItemsCopy.twinStairDoors + +differenceFromMatch
        countedItemsCopy.twinStairDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
    }
  } else if (!isNaN(selectedBaseStampIndex)) {
    
    defaultMultiplierValRef.current = +e.target.value
    let matchingMultiplier = fauxBaseArray[selectedBaseStampIndex].multiplier
    fauxBaseArray[selectedBaseStampIndex].multiplier = +e.target.value
    let differenceFromMatch = e.target.value - matchingMultiplier
    // console.log(differenceFromMatch)
      fauxAllBaseArray.map((base, index) => {
       if(fauxBaseArray[selectedBaseStampIndex].pageNum == base.pageNum && fauxBaseArray[selectedBaseStampIndex].xCoord == base.xCoord && fauxBaseArray[selectedBaseStampIndex].yCoord == base.yCoord)
       {
          fauxAllBaseArray[index].multiplier = +e.target.value
        }
      })
      //Setting the array & re-setting the selected index.
      setAllBaseCountArray(fauxAllBaseArray)
      setBaseCountArray(fauxBaseArray)

      if (countedItemsCopy == undefined) {console.error('ERROR APP.JS : countsState == undefined')}
      // console.log(fauxDoorArray[selectedDoorStampIndex].type)
      let addedCount = 0
      let bbInt = +countedItemsCopy.baseBoard16 + +differenceFromMatch
      countedItemsCopy.baseBoard16 = bbInt
      setCountsState(countedItemsCopy)



    





    console.log('multiStick')
  } else if (selectedArrayStamps.length != 0 && selectedArraySticks.length != 0) {
    
    




    defaultMultiplierValRef.current = +e.target.value
    let matchBoxArray = []

    selectedArrayStamps.map((val) => {
      let differenceFromMatch = 0
      let tempDoorType = ''
      doorCountArray.map((door, index) => {
        if (val == index) {
          differenceFromMatch = +e.target.value - +door.multiplier
          door.multiplier = +e.target.value
          let tempDoor = {
            type : door.type,
            xCoord: door.xCoord,
            yCoord: door.yCoord,
            pageNum: door.pageNum,
            multiplier: door.multiplier,
          }
          tempDoorType = door.type
          matchBoxArray.push(tempDoor)
          //THE PROBLEM IS THAT THE ALL ARRAYS ARE NEVER UPDATED!!!!
          //SEEMS TO ONLY BE IN THE BOTH STICK & STAMP IF CONDITION AKA THE ONE WE'RE IN.
        }
      })
      console.log(doorCountArray)
      console.log(differenceFromMatch)
      let addedCount = 0
      switch (tempDoorType) {
        case 'entryDoor' :
        addedCount = +countedItemsCopy.entryDoors + +differenceFromMatch
        countedItemsCopy.entryDoors = addedCount
      break;
      case 'privacyDoor' :
        addedCount = +countedItemsCopy.privacyDoors + +differenceFromMatch
        countedItemsCopy.privacyDoors = addedCount
      break;
      case 'passageDoor' :
        addedCount = +countedItemsCopy.passageDoors + +differenceFromMatch
        countedItemsCopy.passageDoors = addedCount
      break;
      case 'twinPassageDoor' :
        addedCount = +countedItemsCopy.twinPassageDoors + +differenceFromMatch
        countedItemsCopy.twinPassageDoors = addedCount
      break;
      case 'slidingDoor' :
        addedCount = +countedItemsCopy.slidingDoors + +differenceFromMatch
        countedItemsCopy.slidingDoors = addedCount
      break;
      case 'louverDoor' :
        addedCount = +countedItemsCopy.louverDoors + +differenceFromMatch
        countedItemsCopy.louverDoors = addedCount
      break;
      case 'commercialDoor' :
        addedCount = +countedItemsCopy.commercialDoors + +differenceFromMatch
        countedItemsCopy.commercialDoors = addedCount
      break;
      case 'twinCommercialDoor' :
        addedCount = +countedItemsCopy.twinCommercialDoors + +differenceFromMatch
        countedItemsCopy.twinCommercialDoors = addedCount
      break;
      case 'stairDoor' :
        addedCount = +countedItemsCopy.stairDoors + +differenceFromMatch
        countedItemsCopy.stairDoors = addedCount
      break;
      case 'heavyFireDoor' :
        addedCount = +countedItemsCopy.heavyFireDoors + +differenceFromMatch
        countedItemsCopy.heavyFireDoors = addedCount
      break;
      case 'windowsThreeFT' :
        addedCount = +countedItemsCopy.windowsThreeFT + +differenceFromMatch
        countedItemsCopy.windowsThreeFT = addedCount
      break;
      case 'windowsSixFT' :
        addedCount = +countedItemsCopy.windowsSixFT + +differenceFromMatch
        countedItemsCopy.windowsSixFT = addedCount
      break;
      case 'windowsNineFt' :
        addedCount = +countedItemsCopy.windowsNineFt + +differenceFromMatch
        countedItemsCopy.windowsNineFt = addedCount
      break;
      case 'patioCasing' :
        addedCount = +countedItemsCopy.patioCasings + +differenceFromMatch
        countedItemsCopy.patioCasings = addedCount
      break;
      case 'twinLouvers' :
        addedCount = +countedItemsCopy.twinLouvers + +differenceFromMatch
        countedItemsCopy.twinLouvers = addedCount
      break;
      case 'twinSliders' :
        addedCount = +countedItemsCopy.twinSliders + +differenceFromMatch
        countedItemsCopy.twinSliders = addedCount
      break;
      case 'pocketDoors' :
        addedCount = +countedItemsCopy.pocketDoors + +differenceFromMatch
        countedItemsCopy.pocketDoors = addedCount
      break;
      case 'twinHeavyFireDoors' :
        addedCount = +countedItemsCopy.twinHeavyFireDoors + +differenceFromMatch
        countedItemsCopy.twinHeavyFireDoors = addedCount
      break;
      case 'twinStairDoors' :
        addedCount = +countedItemsCopy.twinStairDoors + +differenceFromMatch
        countedItemsCopy.twinStairDoors = addedCount
      break;
      }
    })
    matchBoxArray.map((matchDoor) => {
      fauxAllDoorArray.map((door, index) => {
        if (matchDoor.pageNum == door.pageNum && matchDoor.xCoord == door.xCoord && matchDoor.yCoord == door.yCoord) {
          fauxAllDoorArray[index].multiplier = matchDoor.multiplier
          console.log(fauxAllDoorArray[index])
          console.log(matchDoor.multiplier)
        }
      })
    })

    let matchStickArray = []
    
    defaultMultiplierValRef.current = +e.target.value
    selectedArraySticks.map((val) => {
      let differenceFromMatch = 0
      let tempStickType = ''
      baseCountArray.map((base, index) => {
        if (val == index) {
          differenceFromMatch = +e.target.value - +base.multiplier
          base.multiplier = +e.target.value
          tempStickType = base.type
          let tempStick = {
            type: base.type,
            xCoord: base.xCoord,
            yCoord: base.yCoord,
            pageNum: base.pageNum,
            multiplier: base.multiplier, 
          }
          matchStickArray.push(tempStick)
        }
      })

      
      console.log(differenceFromMatch)
      let addedCount = 0
        addedCount = +countedItemsCopy.baseBoard16 + +differenceFromMatch
        countedItemsCopy.baseBoard16 = addedCount
    })



    matchStickArray.map((matchStick) => {
      fauxAllBaseArray.map((base, index) => {
        if (matchStick.pageNum == base.pageNum && matchStick.xCoord == base.xCoord && matchStick.yCoord == base.yCoord) {
          fauxAllBaseArray[index].multiplier = matchStick.multiplier
          console.log(fauxAllBaseArray[index])
          console.log(matchStick.multiplier)
        }
      })
    })



    
    setAllDoorCountArray(fauxAllDoorArray)
    setDoorCountArray(fauxDoorArray)
    setAllBaseCountArray(fauxAllBaseArray)
    setBaseCountArray(fauxBaseArray)
    setCountsState(countedItemsCopy)













    console.log('bothStamp&BaseArray')
  } else if (selectedArrayStamps.length != 0) {
    defaultMultiplierValRef.current = +e.target.value
    
    selectedArrayStamps.map((val) => {
      let differenceFromMatch = 0
      let tempDoorType = ''
      doorCountArray.map((door, index) => {
        if (val == index) {
          differenceFromMatch = +e.target.value - +door.multiplier
          door.multiplier = +e.target.value
          tempDoorType = door.type
        }
      })
      console.log(differenceFromMatch)
      let addedCount = 0
      switch (tempDoorType) {
        case 'entryDoor' :
        addedCount = +countedItemsCopy.entryDoors + +differenceFromMatch
        countedItemsCopy.entryDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'privacyDoor' :
        addedCount = +countedItemsCopy.privacyDoors + +differenceFromMatch
        countedItemsCopy.privacyDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'passageDoor' :
        addedCount = +countedItemsCopy.passageDoors + +differenceFromMatch
        countedItemsCopy.passageDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'twinPassageDoor' :
        addedCount = +countedItemsCopy.twinPassageDoors + +differenceFromMatch
        countedItemsCopy.twinPassageDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'slidingDoor' :
        addedCount = +countedItemsCopy.slidingDoors + +differenceFromMatch
        countedItemsCopy.slidingDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'louverDoor' :
        addedCount = +countedItemsCopy.louverDoors + +differenceFromMatch
        countedItemsCopy.louverDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'commercialDoor' :
        addedCount = +countedItemsCopy.commercialDoors + +differenceFromMatch
        countedItemsCopy.commercialDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'twinCommercialDoor' :
        addedCount = +countedItemsCopy.twinCommercialDoors + +differenceFromMatch
        countedItemsCopy.twinCommercialDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'stairDoor' :
        addedCount = +countedItemsCopy.stairDoors + +differenceFromMatch
        countedItemsCopy.stairDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'heavyFireDoor' :
        addedCount = +countedItemsCopy.heavyFireDoors + +differenceFromMatch
        countedItemsCopy.heavyFireDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'windowsThreeFT' :
        addedCount = +countedItemsCopy.windowsThreeFT + +differenceFromMatch
        countedItemsCopy.windowsThreeFT = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'windowsSixFT' :
        addedCount = +countedItemsCopy.windowsSixFT + +differenceFromMatch
        countedItemsCopy.windowsSixFT = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'windowsNineFt' :
        addedCount = +countedItemsCopy.windowsNineFt + +differenceFromMatch
        countedItemsCopy.windowsNineFt = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'patioCasing' :
        addedCount = +countedItemsCopy.patioCasings + +differenceFromMatch
        countedItemsCopy.patioCasings = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'twinLouvers' :
        addedCount = +countedItemsCopy.twinLouvers + +differenceFromMatch
        countedItemsCopy.twinLouvers = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'twinSliders' :
        addedCount = +countedItemsCopy.twinSliders + +differenceFromMatch
        countedItemsCopy.twinSliders = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'pocketDoors' :
        addedCount = +countedItemsCopy.pocketDoors + +differenceFromMatch
        countedItemsCopy.pocketDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'twinHeavyFireDoors' :
        addedCount = +countedItemsCopy.twinHeavyFireDoors + +differenceFromMatch
        countedItemsCopy.twinHeavyFireDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      case 'twinStairDoors' :
        addedCount = +countedItemsCopy.twinStairDoors + +differenceFromMatch
        countedItemsCopy.twinStairDoors = addedCount
        setCountsState(countedItemsCopy)
      break;
      }
       
    })
    setAllDoorCountArray(fauxAllDoorArray)
    setDoorCountArray(fauxDoorArray)

    console.log('stampsArray')
  } else if (selectedArraySticks.length != 0) {
    console.log('sticksArray')
    defaultMultiplierValRef.current = +e.target.value
    selectedArraySticks.map((val) => {
      let differenceFromMatch = 0
      let tempStickType = ''
      baseCountArray.map((base, index) => {
        if (val == index) {
          differenceFromMatch = +e.target.value - +base.multiplier
          base.multiplier = +e.target.value
          tempStickType = base.type
        }
      })

      
      console.log(differenceFromMatch)
      let addedCount = 0
        addedCount = +countedItemsCopy.baseBoard16 + +differenceFromMatch
        countedItemsCopy.baseBoard16 = addedCount
        setCountsState(countedItemsCopy)
    })
    setAllBaseCountArray(fauxAllBaseArray)
    setBaseCountArray(fauxBaseArray)
  }
}



const openCloseMultiplierInput = (val) => {
  console.log(val)
  setMultiSelectToggle(val)
}

  const findSelectedRange = (smallX, smallY, bigX, bigY) => {
    // console.log(smallX)
    // console.log(bigX)
    // console.log(smallY)
    // console.log(bigY)
    let matchingStamps = []
    doorCountArray.map((doorData, index) => {
      if (
        doorData.yCoord > smallY &&
        doorData.yCoord < bigY &&
        doorData.xCoord > smallX &&
        doorData.xCoord < bigX
      ) {
        // console.log(doorData)
         matchingStamps.push(index)}
    })
    // console.log(matchingStamps)
    setSelectedArrayStamps(matchingStamps)
    let matchingSticks = []
    baseCountArray.map((baseData, index) => {
      if (
        baseData.yCoord > smallY &&
        baseData.yCoord < bigY &&
        baseData.xCoord > smallX &&
        baseData.xCoord < bigX
      ) {
        // console.log(baseData)
        matchingSticks.push(index)}
    })
    // console.log(matchingSticks)
    setSelectedArraySticks(matchingSticks)

    if (matchingStamps.length != 0 || matchingSticks.length != 0) {
      openCloseMultiplierInput(true)
    } else {
      if (multiSelectToggle == true) {
        openCloseMultiplierInput(false)
      }
    }

    setSelectedDoorStampIndex(NaN)
    setSelectedBaseStampIndex(NaN)

  }


  //stampCLickHandler is passed down to the child stamps & runs when a stamp is clicked.
  const stampClickHandler = (index) => {
    //This if statement checks whether or not the stamp is already selected, or if another stamp/stick is selected, and de-selects it if so.
    if (index == selectedDoorStampIndex) {
      setSelectedDoorStampIndex(NaN)
      setSelectedBaseStampIndex(NaN)
      openCloseMultiplierInput(false)
    } else {
      setSelectedBaseStampIndex(NaN)
      setSelectedDoorStampIndex(index)
      setSelectedArrayStamps([])
      setSelectedArraySticks([])
      openCloseMultiplierInput(true)
      defaultMultiplierValRef.current = doorCountArray[index].multiplier
      console.log(defaultMultiplierValRef.current)
    }
  }

  const baseStampClickHandler = (index) => {
    // console.log(selectedBaseStampIndex, index)
    if (index == selectedBaseStampIndex) {
      setSelectedDoorStampIndex(NaN)
      setSelectedBaseStampIndex(NaN)
      openCloseMultiplierInput(false)
    } else {
      setSelectedDoorStampIndex(NaN)
      setSelectedBaseStampIndex(index)
      setSelectedArrayStamps([])
      setSelectedArraySticks([])
      openCloseMultiplierInput(true)
      defaultMultiplierValRef.current = baseCountArray[index].multiplier
      console.log(defaultMultiplierValRef.current)
    }
  }

  //deleteDoorCountArray acts simply to remove a door stamp from the both states of arrays of doors & the countState
  const deleteDoorCountArray = () => {
    //We must de-structure the array to ensure live-re-rendering!!
    let fauxDoorArray = [...doorCountArray]
    let fauxAllDoorArray = [...allDoorCountArray]
    

    if (selectedArrayStamps.length != 0) {  

      let deletedDoors = []
      let countedItemsCopy = {...countsState}
      selectedArrayStamps.reverse().map(val => {
        return doorCountArray.map((door, index) => {
          if (val == index) {
            // console.log(door)
            let spliceDump = fauxDoorArray.splice(index, 1)
            let popSplice = spliceDump.pop()
            deletedDoors.push(popSplice)

          }
        })
      })
      setDoorCountArray(fauxDoorArray)
      deletedDoors.map((delDoor) => {
        allDoorCountArray.map((door, index) => {
          if (delDoor.pageNum == door.pageNum && delDoor.xCoord == door.xCoord && delDoor.yCoord == door.yCoord) {
            let spliceDump = fauxAllDoorArray.splice(index, 1)
          }
        })
        // console.log(delDoor.type)
        switch (delDoor.type) {
          case 'entryDoor' :
          countedItemsCopy.entryDoors -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'privacyDoor' :
          countedItemsCopy.privacyDoors -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'passageDoor' :
          countedItemsCopy.passageDoors -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'twinPassageDoor' :
          countedItemsCopy.twinPassageDoors -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'slidingDoor' :
          countedItemsCopy.slidingDoors -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'louverDoor' :
          countedItemsCopy.louverDoors -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'commercialDoor' :
          countedItemsCopy.commercialDoors -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'twinCommercialDoor' :
          countedItemsCopy.twinCommercialDoors -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'stairDoor' :
          countedItemsCopy.stairDoors -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'heavyFireDoor' :
          countedItemsCopy.heavyFireDoors -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'windowsThreeFT' :
          countedItemsCopy.windowsThreeFT -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'windowsSixFT' :
          countedItemsCopy.windowsSixFT -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'windowsNineFt' :
          countedItemsCopy.windowsNineFt -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'patioCasing' :
          countedItemsCopy.patioCasings -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'twinLouvers' :
          countedItemsCopy.twinLouvers -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'twinSliders' :
          countedItemsCopy.twinSliders -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'pocketDoors' :
          countedItemsCopy.pocketDoors -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'twinHeavyFireDoors' :
          countedItemsCopy.twinHeavyFireDoors -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        case 'twinStairDoors' :
          countedItemsCopy.twinStairDoors -= +delDoor.multiplier
          setCountsState(countedItemsCopy)
        break;
        }

      })
      // console.log(fauxAllDoorArray)

      

      setAllDoorCountArray(fauxAllDoorArray)
      setSelectedArrayStamps([])
    } else if (!isNaN(selectedDoorStampIndex) ) {
      //Splicing at the selected index. Ensuring to save splicedOffDoor for later.
      let splicedOffDoor = fauxDoorArray.splice(selectedDoorStampIndex, 1)
      
      //Here we map over the entire ALL array, finding which index maches.
      fauxAllDoorArray.map((door, index) => {
        // console.log(door)
        // console.log(splicedOffDoor[0])
        //This if condition checks pageNum, xCoord, yCoord to ensure the item is an exact match. If so, it is also removed from the ALL door array.
        if(splicedOffDoor[0].pageNum == door.pageNum && splicedOffDoor[0].xCoord == door.xCoord && splicedOffDoor[0].yCoord == door.yCoord){
          // console.log('SUCCESS', door, index)
          let splicedOffAllDoor = fauxAllDoorArray.splice(index, 1)
        } else {console.log('idk how we got here?! AHH')}
      // console.table(fauxAllDoorArray)
      })
      //Setting the array & re-setting the selected index.
      setAllDoorCountArray(fauxAllDoorArray)
      setDoorCountArray(fauxDoorArray)
      setSelectedDoorStampIndex(NaN)
      let countedItemsCopy = {...countsState}

      //Running a switch to decide which type the splicedOffDoor was. Then removing one of the matching type.
      if (countedItemsCopy == undefined) {console.error('ERROR APP.JS : countsState == undefined')}
      switch (splicedOffDoor[0].type) {
        case 'entryDoor' :
        countedItemsCopy.entryDoors -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'privacyDoor' :
        countedItemsCopy.privacyDoors -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'passageDoor' :
        countedItemsCopy.passageDoors -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'twinPassageDoor' :
        countedItemsCopy.twinPassageDoors -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'slidingDoor' :
        countedItemsCopy.slidingDoors -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'louverDoor' :
        countedItemsCopy.louverDoors -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'commercialDoor' :
        countedItemsCopy.commercialDoors -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'twinCommercialDoor' :
        countedItemsCopy.twinCommercialDoors -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'stairDoor' :
        countedItemsCopy.stairDoors -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'heavyFireDoor' :
        countedItemsCopy.heavyFireDoors -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'windowsThreeFT' :
        countedItemsCopy.windowsThreeFT -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'windowsSixFT' :
        countedItemsCopy.windowsSixFT -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'windowsNineFt' :
        countedItemsCopy.windowsNineFt -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'patioCasing' :
        countedItemsCopy.patioCasings -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'twinLouvers' :
        countedItemsCopy.twinLouvers -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'twinSliders' :
        countedItemsCopy.twinSliders -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'pocketDoors' :
        countedItemsCopy.pocketDoors -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'twinHeavyFireDoors' :
        countedItemsCopy.twinHeavyFireDoors -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
      case 'twinStairDoors' :
        countedItemsCopy.twinStairDoors -= +splicedOffDoor[0].multiplier
        setCountsState(countedItemsCopy)
      break;
    }
  } else {console.error('WTF CHECK deleteDoorCountArray')}
  }
  
  const deleteBaseCountArray = () => {

    //To find comments on this, please refer to the deleteDoorCountArray method, which is identical but for stamps.
    let fauxBaseArray = [...baseCountArray]
    let fauxAllBaseArray = [...allBaseCountArray]
    console.log(selectedArraySticks)

    if (selectedArraySticks.length != 0) {


      let deletedSticks = []
      let countedItemsCopy = {...countsState}
      selectedArraySticks.reverse().map(val => {
        return baseCountArray.map((base, index) => {
          if (val == index) {
            // console.log(base)
            let spliceDump = fauxBaseArray.splice(index, 1)
            let popSplice = spliceDump.pop()
            deletedSticks.push(popSplice)

          }
        })
      })
      console.log(fauxBaseArray)
      setBaseCountArray(fauxBaseArray)
      deletedSticks.reverse().map((delBase) => {
        fauxAllBaseArray.map((base, index) => {
          if (delBase.pageNum == base.pageNum && delBase.xCoord == base.xCoord && delBase.yCoord == base.yCoord) {
            let spliceDump = fauxAllBaseArray.splice(index, 1)
          }
        })
        countedItemsCopy.baseBoard16 -= +delBase.multiplier
        setCountsState(countedItemsCopy)
      })
      // console.log(fauxAllBaseArray)
      setAllBaseCountArray(fauxAllBaseArray)
      setSelectedArraySticks([])



    } else if (!isNaN(selectedBaseStampIndex)) {
      let fauxBaseArray = [...baseCountArray]
    let fauxAllBaseArray = [...allBaseCountArray]
      // console.log('test')
      //Splicing at the selected index. Ensuring to save splicedOffDoor for later.
      let splicedOffBase = fauxBaseArray.splice(selectedBaseStampIndex, 1)

      fauxAllBaseArray.map((stick, index) => {
        if(splicedOffBase[0].pageNum == stick.pageNum && splicedOffBase[0].xCoord == stick.xCoord && splicedOffBase[0].yCoord == stick.yCoord) {
          // console.log('SUCCESS', stick, index)
          let splicedOffAllBase = fauxAllBaseArray.splice(index, 1)
        }
      })
      //Setting the array & re-setting the selected index.
      setAllBaseCountArray(fauxAllBaseArray)
      setBaseCountArray(fauxBaseArray)
      setSelectedBaseStampIndex(NaN)
      let countedItemsCopy = {...countsState}

      //Running a switch to decide which type the splicedOffDoor was. Then removing one of the matching type.
      if (countedItemsCopy == undefined) {console.error('ERROR APP.JS : countsState == undefined')}
      switch (splicedOffBase[0].type) {
        case 'baseBoard16':
          countedItemsCopy.baseBoard16 -= splicedOffBase[0].multiplier
          setCountsState(countedItemsCopy)
        break;
      }
    } else {console.log('idk how we got here?! AHH')}
  }


const deleteSticksStampInRange = () => {
  let fauxBaseArray = [...baseCountArray]
  let fauxAllBaseArray = [...allBaseCountArray]
  let fauxDoorArray = [...doorCountArray]
  let fauxAllDoorArray = [...allDoorCountArray]

  console.log(selectedArrayStamps)
  let deletedDoors = []
  let countedItemsCopy = {...countsState}
  selectedArrayStamps.reverse().map(val => {
    return doorCountArray.map((door, index) => {
      if (val == index) {
        // console.log(door)
        let spliceDump = fauxDoorArray.splice(index, 1)
        let popSplice = spliceDump.pop()
        deletedDoors.push(popSplice)

      }
    })
  })
  console.log(fauxDoorArray)
  console.log(deletedDoors)
  setDoorCountArray(fauxDoorArray)
  deletedDoors.map((delDoor) => {
    allDoorCountArray.map((door, index) => {
      if (delDoor.pageNum == door.pageNum && delDoor.xCoord == door.xCoord && delDoor.yCoord == door.yCoord) {
        let spliceDump = fauxAllDoorArray.splice(index, 1)
      }
    })
    console.log(delDoor.type)
    switch (delDoor.type) {
      case 'entryDoor' :
      countedItemsCopy.entryDoors -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'privacyDoor' :
      countedItemsCopy.privacyDoors -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'passageDoor' :
      countedItemsCopy.passageDoors -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'twinPassageDoor' :
      countedItemsCopy.twinPassageDoors -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'slidingDoor' :
      countedItemsCopy.slidingDoors -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'louverDoor' :
      countedItemsCopy.louverDoors -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'commercialDoor' :
      countedItemsCopy.commercialDoors -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'twinCommercialDoor' :
      countedItemsCopy.twinCommercialDoors -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'stairDoor' :
      countedItemsCopy.stairDoors -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'heavyFireDoor' :
      countedItemsCopy.heavyFireDoors -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'windowsThreeFT' :
      countedItemsCopy.windowsThreeFT -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'windowsSixFT' :
      countedItemsCopy.windowsSixFT -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'windowsNineFt' :
      countedItemsCopy.windowsNineFt -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'patioCasing' :
      countedItemsCopy.patioCasings -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'twinLouvers' :
      countedItemsCopy.twinLouvers -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'twinSliders' :
      countedItemsCopy.twinSliders -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'pocketDoors' :
      countedItemsCopy.pocketDoors -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'twinHeavyFireDoors' :
      countedItemsCopy.twinHeavyFireDoors -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    case 'twinStairDoors' :
      countedItemsCopy.twinStairDoors -= +delDoor.multiplier
      setCountsState(countedItemsCopy)
    break;
    }

  })

  
  // console.log(fauxAllDoorArray)
  setAllDoorCountArray(fauxAllDoorArray)
  setSelectedArrayStamps([])
  

  console.log(selectedArraySticks)
  let deletedSticks = []
  selectedArraySticks.reverse().map(val => {
    return baseCountArray.map((base, index) => {
      if (val == index) {
        // console.log(base)
        let spliceDump = fauxBaseArray.splice(index, 1)
        let popSplice = spliceDump.pop()
        deletedSticks.push(popSplice)

      }
    })
  })
  console.log(fauxBaseArray)
  console.log(deletedSticks)
  setBaseCountArray(fauxBaseArray)
  deletedSticks.reverse().map((delBase) => {
    console.log(delBase)
    fauxAllBaseArray.map((base, index) => {
      if (delBase.pageNum == base.pageNum && delBase.xCoord == base.xCoord && delBase.yCoord == base.yCoord) {
        let spliceDump = fauxAllBaseArray.splice(index, 1)
      }
    })
    countedItemsCopy.baseBoard16 -= +delBase.multiplier
    setCountsState(countedItemsCopy)
  })
  // console.log(fauxAllBaseArray)
  setAllBaseCountArray(fauxAllBaseArray)
  setSelectedArraySticks([])
}
   
  //updateDoorCountArray is a proxy function to assemble a door object before pushing it to the doorCountArray. 
  const updateDoorCountArray = (x, y, type, aspectRatio) => {
    console.table({x: x, y: y, type: type})
    let doorStampColor = ''
    let doorStampShape = ''
    //Switch to set color & shape.
    switch(type) {
      case 'entryDoor' :
        doorStampColor = 'rgba(255, 0, 0, 0.4)'
        doorStampShape = 'square'
      break;
      case 'privacyDoor' :
        doorStampColor = 'rgba(255, 251, 0, 0.4)'
        doorStampShape = 'square'
      break;
      case 'passageDoor' :
        doorStampColor = 'rgba(136, 255, 0, 0.4)'
        doorStampShape = 'square'
      break;
      case 'twinPassageDoor' :
        doorStampColor = 'rgba(38, 255, 0, 0.4)'
        doorStampShape = 'square'
      break;
      case 'slidingDoor' :
        doorStampColor = 'rgba(0, 255, 68, 0.4)'
        doorStampShape = 'square'
      break;
      case 'louverDoor' :
        doorStampColor = 'rgba(255, 174, 0, 0.4)'
        doorStampShape = 'square'
      break;
      case 'commercialDoor' :
        doorStampColor = 'rgba(255, 0, 221, 0.4)'
        doorStampShape = 'square'
      break;
      case 'twinCommercialDoor' :
        doorStampColor = 'rgba(221, 0, 255, 0.4)'
        doorStampShape = 'square'
      break;
      case 'stairDoor' :
        doorStampColor = 'rgba(255, 0, 149, 0.4)'
        doorStampShape = 'square'
      break;
      case 'heavyFireDoor' :
        doorStampColor = 'rgba(255, 0, 76, 0.4)'
        doorStampShape = 'square'
      break;
      case 'windowsThreeFT' :
        doorStampColor = 'rgba(0, 255, 255, 0.4)'
        doorStampShape = 'circle'
      break;
      case 'windowsSixFT' :
        doorStampColor = 'rgba(0, 195, 255, 0.4)'
        doorStampShape = 'circle'
      break;
      case 'windowsNineFt' :
        doorStampColor = 'rgba(0, 140, 255, 0.4)'
        doorStampShape = 'circle'
      break;
      case 'patioCasing' :
        doorStampColor = 'rgba(0, 255, 191, 0.4)'
        doorStampShape = 'circle'
      break;
      case 'twinLouvers' :
        doorStampColor = 'rgba(255, 191, 0, 0.4)'
        doorStampShape = 'square'
      break;
      case 'twinSliders' :
        doorStampColor = 'rgba(0, 255, 95, 0.4)'
        doorStampShape = 'square'
      break;
      case 'pocketDoors' :
        doorStampColor = 'rgba(154, 0, 255, 0.4)'
        doorStampShape = 'square'
      break;
      case 'twinHeavyFireDoors' :
        doorStampColor = 'rgba(255, 0, 60, 0.4)'
        doorStampShape = 'square'
      break;
      case 'twinStairDoors' :
        doorStampColor = 'rgba(255, 0, 155, 0.4)'
        doorStampShape = 'square'
      break;
    }
    //Destructure the array to ensure live-re-rendering!
    let fauxDoorCountArray = [...doorCountArray]
    let fauxAllDoorCountArray = [...allDoorCountArray]
    //Pushing assembled object to faux array of all doors.
    fauxDoorCountArray.push({pageNum: +chosenPageRef.current, xCoord: x, yCoord: y, type: type, shape: doorStampShape, color: doorStampColor, multiplier: 1})
    fauxAllDoorCountArray.push({pageNum: +chosenPageRef.current, xCoord: x, yCoord: y, type: type, shape: doorStampShape, color: doorStampColor, multiplier: 1})
    //Setting the states
    setDoorCountArray(fauxDoorCountArray)
    setAllDoorCountArray(fauxAllDoorCountArray)
  }


  //The stick equivalent of updateDoorCountArray, this is much smaller because it doesn't have the switch. Base is base.
  const processLineDraw = (xCoord, yCoord, stickLength, stickDirection, type) => {
    // console.log(xCoord, yCoord, stickLength, stickDirection, type)
    let baseCountArrayCopy = [...baseCountArray]
    let allBaseCountArrayCopy = [...allBaseCountArray]
    baseCountArrayCopy.push({pageNum: +chosenPageRef.current, xCoord: xCoord, yCoord: yCoord, type: type, shape: 'line', color: 'rgba(74, 200, 40, 0.5)', multiplier: 1, length: stickLength, direction: stickDirection,})
    allBaseCountArrayCopy.push({pageNum: +chosenPageRef.current, xCoord: xCoord, yCoord: yCoord, type: type, shape: 'line', color: 'rgba(74, 200, 40, 0.5)', multiplier: 1, length: stickLength, direction: stickDirection,})
    setBaseCountArray(baseCountArrayCopy)
    setAllBaseCountArray(allBaseCountArrayCopy)

    
    
  }

//darkModeLightSwitch is a lightswitch. Saves & pulls data from localStorage.
  const darkModeLightSwitch = () => {
    let darkBoolean = darkMode
    if (darkBoolean == 'dark') {
      localStorage.setItem('darkOrLight', 'light')
      setDarkMode('light')
    } else if (darkBoolean == 'light') {
      localStorage.setItem('darkOrLight', 'dark')
      setDarkMode('dark')
    } else {console.error('no boolean value for darkMode local variable!')}
  }

  //Take a wild guess what this function does.
  const saveButton = async() => {
    //Assembling an obj into a reference so it can be called live for the POST.
    //Gathers literally every piece of data at once.
    bundledValueBucket.current = {
      info: [...takeOffInfo],
      counts: {...countsState},
      stamps: [...allDoorCountArray],
      sticks: [...allBaseCountArray],
    }
    console.log(bundledValueBucket.current)
    try {
    const res = await fetch(baseUrl + postPoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({parcel: bundledValueBucket.current}),
    })
    //The response here is to ensure the save was sent successfully.
    //IF the save fails, setSaveStatus will set to 'FAILED', which causes a window.alert() & instructs the user to contact me :)
    .then(signal => signal.json())
    .then(data => {
      if (data.signal == 'SAVED') {
        setSaveStatus('SAVED')
      } else if (data.signal == 'FAILED') {
        setSaveStatus('FAILED')
        window.alert('DATA DID NOT SAVE. PLEASE TEXT SEB & DO NOT CLOSE THIS PAGE :). HE CAN ONLY FIX THIS IF HE CAN SEE THE PROBLEM!')
      }
      console.log(data.signal)}
      )
    } catch(err) {window.alert(err)}
  }

  //proxy func passed to header to choosen chosenItemType
  const proxySetChosenItemType = (val) => {
    setChosenItemType(val)
  }

  //proxy func passed to BluePrintBackground that runs when the page image is loaded.
  const updateCanvasSizeImageDims = () => {
    // console.log(backgroundImageRef.current.width)
    setCanvasDims([backgroundImageRef.current.width, backgroundImageRef.current.height])
    // console.log((backgroundImageRef.current.height / backgroundImageRef.current.width) * ( backgroundImageRef.current.height * 0.02)/2)
  }

  //Used to increment the countsState whenever a new stamp is added.
  const typeCountUpdater = (type) => {
    //Destructure your objects to ensure live re-renders kids!
    let countedItemsCopy = {...countsState}
    
    //Logic to ensure countState is loaded before proceeding.
    if (countedItemsCopy == undefined) {console.error('ERROR APP.JS : countsState == undefined')}
    //Switch to increment the proper count.
    switch (type) {
      case 'entryDoor' :
        countedItemsCopy.entryDoors++
        setCountsState(countedItemsCopy)
      break;
      case 'privacyDoor' :
        countedItemsCopy.privacyDoors++
        setCountsState(countedItemsCopy)
      break;
      case 'passageDoor' :
        countedItemsCopy.passageDoors++
        setCountsState(countedItemsCopy)
      break;
      case 'twinPassageDoor' :
        countedItemsCopy.twinPassageDoors++
        setCountsState(countedItemsCopy)
      break;
      case 'slidingDoor' :
        countedItemsCopy.slidingDoors++
        setCountsState(countedItemsCopy)
      break;
      case 'louverDoor' :
        countedItemsCopy.louverDoors++
        setCountsState(countedItemsCopy)
      break;
      case 'commercialDoor' :
        countedItemsCopy.commercialDoors++
        setCountsState(countedItemsCopy)
      break;
      case 'twinCommercialDoor' :
        countedItemsCopy.twinCommercialDoors++
        setCountsState(countedItemsCopy)
      break;
      case 'stairDoor' :
        countedItemsCopy.stairDoors++
        setCountsState(countedItemsCopy)
      break;
      case 'heavyFireDoor' :
        countedItemsCopy.heavyFireDoors++
        setCountsState(countedItemsCopy)
      break;
      case 'windowsThreeFT' :
        countedItemsCopy.windowsThreeFT++
        setCountsState(countedItemsCopy)
      break;
      case 'windowsSixFT' :
        countedItemsCopy.windowsSixFT++
        setCountsState(countedItemsCopy)
      break;
      case 'windowsNineFt' :
        countedItemsCopy.windowsNineFt++
        setCountsState(countedItemsCopy)
      break;
      case 'patioCasing' :
        countedItemsCopy.patioCasings++
        setCountsState(countedItemsCopy)
      break;
      case 'twinLouvers' :
        countedItemsCopy.twinLouvers++
        setCountsState(countedItemsCopy)
      break;
      case 'twinSliders' :
        countedItemsCopy.twinSliders++
        setCountsState(countedItemsCopy)
      break;
      case 'pocketDoors' :
        countedItemsCopy.pocketDoors++
        setCountsState(countedItemsCopy)
      break;
      case 'twinHeavyFireDoors' :
        countedItemsCopy.twinHeavyFireDoors++
        setCountsState(countedItemsCopy)
      break;
      case 'twinStairDoors' :
        countedItemsCopy.twinStairDoors++
        setCountsState(countedItemsCopy)
      break;
      case 'vertical16' :
      case 'horizontal16' :
        countedItemsCopy.baseBoard16++
        setCountsState(countedItemsCopy)
      break;
    }
}

//Registers the delete or backspace keys. Will probably host more keys later.
window.onkeydown = (function(e) {
  e.preventDefault();
  switch(e.which) {
    case 8:
    case 46:

      if (selectedArrayStamps.length != 0 && selectedArraySticks.length != 0) {
        deleteSticksStampInRange()

      } else if (!isNaN(selectedDoorStampIndex) || selectedArrayStamps.length != 0) {
        deleteDoorCountArray()
      } else if (!isNaN(selectedBaseStampIndex) || selectedArraySticks.length != 0) {
        deleteBaseCountArray()
      } else {
        console.error('nothing selected')
      }
      
    break;
  }
})

//This func runs whenever forward or backward pagination is called from pageBack or pageForward.
//Its purpose is to re-render the per-page doorCountArray & baseCountArray. Doing so forces a re-render of all stamps/sticks and updates the page!
//I would very much not like to call the ALL version every time the page changes, maybe there is a workaround for that.
const newPageOfItemsGenerator = (pageNum) => {
  //Making live copies!
  let stampCopy = []
  stampCopy = [...allDoorCountArray]
  let stickCopy = []
  stickCopy = [...allBaseCountArray]
  // console.log(stampCopy, stickCopy)
  let allMatchingSticks = []
  //Map to match new pageNum, and push matching objects to current per-page array.
  allBaseCountArray.map(stickData => {
    if (+stickData.pageNum == +pageNum) {
      allMatchingSticks.push(stickData)
    }
  setBaseCountArray(allMatchingSticks)
  })
  // console.log(allMatchingSticks)
  let allMatchingStamps = []
  //Map to match new pageNum, and push matching objects to current per-page array.
  allDoorCountArray.map(stampData => {
    if (+stampData.pageNum == +pageNum) {
      allMatchingStamps.push(stampData)
    }
  setDoorCountArray(allMatchingStamps)
  })
  
  // console.log(allDoorCountArray)
}

//decrements then sets state/ref & calls function above.
const pageBack = () => {
  console.log(chosenPageIndex)
  if (chosenPageRef.current == 0) {return}
  chosenPageRef.current--
  setChosenPageIndex(chosenPageRef.current)
  newPageOfItemsGenerator(chosenPageRef.current)
  setSelectedDoorStampIndex(NaN)
  setSelectedBaseStampIndex(NaN)
  setSelectedArrayStamps([])
  setSelectedArraySticks([])
}
//increments then sets state/ref & calls function above.
const pageForward = () => {
  console.log(chosenPageIndex, pageCountArray.length)
  if (chosenPageRef.current == pageCountArray.length) {return}
  chosenPageRef.current++
  setChosenPageIndex(chosenPageRef.current)
  newPageOfItemsGenerator(chosenPageRef.current)
  setSelectedDoorStampIndex(NaN)
  setSelectedBaseStampIndex(NaN)
  setSelectedArrayStamps([])
  setSelectedArraySticks([])
}

//idk honestly
const proxySaveStatus = (val) => {
  setSaveStatus(val)
}

//Simply grabs the value of a selection object, and sets it to a position in the array that is takeoffInfoCopy.
//Doing so re-renders the stamps/sticks becasue they depend on the scale number.
const setScale =(e) => {
  console.log(+e.target.value)
  setChosenBlueprintScale(+e.target.value)
  let takeoffInfoCopy = [...takeOffInfo]
  takeoffInfoCopy[4] = +e.target.value
  console.log(takeoffInfoCopy)
  setTakeOffInfo(takeoffInfoCopy)
  
}




/*--RETURN--*/
//The Bread & Butter
//I'm just going to go over the functional components.
//HeaderBar: The header & side nav panel.
//BluePrintBackground: The actual PNG background. All it returns is a single <img> XML
//CanvasComponent: Something has to hear the clicks & get mouse data. All this returns is a single <canvas> XML
//DoorStamp: Prints all stamps using a single <div>XML, but obviously as many <div> as there are stamps on the page.
//BaseStamp "" sticks 

  return (
    <div className="App" >
      <HeaderBar openCloseMultiplierInput={openCloseMultiplierInput} defaultMultiplierVal={defaultMultiplierValRef.current} handleMultiplierChanger={handleMultiplierChanger} multiSelectToggle={multiSelectToggle} chosenBlueprintScale={chosenBlueprintScale} setScale={setScale} proxySaveStatus={proxySaveStatus} saveStatus={saveStatus} pageBack={pageBack} pageForward={pageForward} saveButton={saveButton} darkModeLightSwitch={darkModeLightSwitch} proxySetChosenItemType={proxySetChosenItemType} countsState={countsState} />
      <div id='app-body'>
      <div className='' id="canvas-frame">
          <div className='canvas-frame-contents' id='canvasFrameContents'>
            <BluePrintBackground chosenPageIndex={chosenPageIndex} pageCountArray={pageCountArray} darkMode={darkMode} backgroundImageRef={backgroundImageRef} updateCanvasSizeImageDims={updateCanvasSizeImageDims} />
            <CanvasComponent findSelectedRange={findSelectedRange} processLineDraw={processLineDraw} chosenItemType={chosenItemType} typeCountUpdater={typeCountUpdater} canvasDims={canvasDims} updateDoorCountArray={updateDoorCountArray}/>
            <div className='svg-frame'>
              {doorCountArray.map((doorObjs,index) => {
                return (
                  <DoorStamp selectedArrayStamps={selectedArrayStamps} chosenBlueprintScale={chosenBlueprintScale} stampClickHandler={stampClickHandler} selectedDoorStampIndex={selectedDoorStampIndex} canvasDims={canvasDims} doorType={doorObjs.type} doorShape={doorObjs.shape} doorColor={doorObjs.color} doorX={doorObjs.xCoord} doorY={doorObjs.yCoord} index={index} key={Math.random()}/>
              )})}
              {baseCountArray.map((basePcs,index) => {
                return (
                  <BaseStamp selectedArraySticks={selectedArraySticks} chosenBlueprintScale={chosenBlueprintScale} baseStampClickHandler={baseStampClickHandler} selectedBaseStampIndex={selectedBaseStampIndex} canvasDims={canvasDims} baseType={basePcs.type} baseShape={basePcs.shape} baseColor={basePcs.color} baseX={basePcs.xCoord} baseY={basePcs.yCoord} index={index} direction={basePcs.direction} key={Math.random()*2}/>
              )})}
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
  );
}

export default App;





  //Scaling Notes:
  //96px = 1inch
  //if a line is drawn at 192px in length (2x 96px = 2pxInch)
  //if the scale of the plans are 1/4" = 1'0"
  //192px == 2pxInch
  //2pxInch /(divided by) 1/4" scale == 8
  //scale equals 1'0" in translation. 2pxInch == 8ft scale.

 //SCALING //MATH
// let scalingIterationCount = (+canvasDims[0]/3600)
    // console.log(canvasDims[0])
    // // let scalingIterationCount = 1
    // let scaledPixelInch = scalingIterationCount * 100
    // // let scaledPixelInch = 100
    // console.log('scale : ' + scalingIterationCount)
    // let pixelInches = (pixelLength / +scaledPixelInch) // == 4 
    // let scaledPixelInches = (pixelInches / chosenBlueprintScale.pageScale) // == 16
    // let toLinearFootageMultiplier = (scaledPixelInches * chosenBlueprintScale.actualSizeScale) // == 16 is actualSizeScale necessary?
    // console.log(toLinearFootageMultiplier + 'ft')
    // // let toInchesMultiplier = toLinearFootageMultiplier * 12
    // // console.log(toInchesMultiplier + ' inches')
    // let countsStateCopy = {...countsState}
    // // console.log(countsStateCopy)
    // let newLFTotal = (+countsStateCopy.baseBoardLF + +toLinearFootageMultiplier);
    // // console.log(newLFTotal)
    // countsStateCopy.baseBoardLF = Math.round(newLFTotal)
    // setCountsState(countsStateCopy)