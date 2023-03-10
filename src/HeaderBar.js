import './App.css'
import {AiOutlineMenuUnfold, AiOutlineMenuFold} from 'react-icons/ai'
import { useState, useRef, useEffect } from 'react'
import {BsSunrise, BsMoonStars, BsSdCard, BsEmojiFrown, BsBoxSeam, BsArrowLeftCircle, BsArrowRightCircle, BsPalette2} from 'react-icons/bs'
import {RxRulerHorizontal} from 'react-icons/rx'
import {CgArrowsHAlt, CgArrowsVAlt} from 'react-icons/cg'
import {HiCursorClick} from 'react-icons/hi'
import {RotatingLines} from "react-loader-spinner"

const HeaderBar = ({defaultMultiplierVal, handleMultiplierChanger, multiSelectToggle, chosenBlueprintScale, setScale, proxySaveStatus, saveStatus, pageBack, pageForward, saveButton, countsState, proxySetChosenItemType, darkModeLightSwitch}) => {
  /*--HOOKS--*/

  //sideBarStatus is a simple reference that determines if the sidebar is active or not.
  const sideBarStatus = useRef(false)
  const stampBackgroundColor = useRef('#1a2d15')

  //darkButtonToggle is the button that runs the lightswitch function in App.js
  const [darkButtonToggle, setDarkButtonToggle] = useState(true)

  //scaleSelectToggle simply flips true or false when the scale button is clicked.
  //its used to show/hide the scale <select> element.
  const [scaleSelectToggle, setScaleSelectToggle] = useState(false)

  const [selectedSideBar, setSelectedSideBar] = useState('null')

  const [materialsState, setMaterialsRef] = useState({
    entrySlabs: 0,
    resHollowSlabs: 0,
    resSolidSlabs: 0,
    louverSlabs: 0,
    steelSlabs: 0,
    viewLiteSlabs: 0,
    heavyFireSlabs: 0,
    entryFrames: 0,
    resFrames: 0,
    pocketFrames: 0,
    steelFrames: 0,
    extensionJambs: 0,
    resBaseLF: 0,
    hallBaseLF: 0,
    doorCasingLF: 0,
    windowCasingLF: 0,
    shoeLF: 0,
    sillLF: 0,
    windowSillLF: 0,
    weatherStripLF: 0,
    passageLocks: 0,
    privacyLocks: 0,
    sliderLocks: 0,
    panicLocks: 0,
    singlePanicDevices: 0,
    verticalPanicDevices: 0,
    entryLocks: 0,
    deadBolts: 0,
    baseDoorStops: 0,
    wallDoorStops: 0,
    sliderTracks: 0,
    sliderFloorGuides: 0,
    resHinges: 0,
    springHinges: 0,
    commercialHinges: 0,
    commercialClosers: 0,
    commercialLocks: 0,
    doorSilencers: 0,
    threeFTSills: 0,
    sixFTSills: 0,
    doorSweeps: 0,
    peepSights: 0,
    doorGuards: 0,
  }) 

  /*--EFFECTS--*/
  useEffect(() => {
    setMaterialsRef({
    entrySlabs: +countsState.entryDoors.toLocaleString("en-US"),
    resHollowSlabs: ((+countsState.passageDoors + (+countsState.twinPassageDoors * 2)) + (+countsState.slidingDoors + (+countsState.twinSliders * 2)) + +countsState.pocketDoors).toLocaleString("en-US"),
    resSolidSlabs: (+countsState.privacyDoors).toLocaleString("en-US"),
    louverSlabs: (+countsState.louverDoors + (+countsState.twinLouvers * 2)).toLocaleString("en-US"),
    steelSlabs: (+countsState.commercialDoors + (+countsState.twinCommercialDoors * 2)).toLocaleString("en-US"),
    viewLiteSlabs: (+countsState.stairDoors + (+countsState.twinStairDoors * 2)).toLocaleString("en-US"),
    heavyFireSlabs: (+countsState.heavyFireDoors + (+countsState.twinHeavyFireDoors * 2)).toLocaleString("en-US"),
    entryFrames: (+countsState.entryDoors).toLocaleString("en-US"),
    resFrames: (+countsState.privacyDoors + +countsState.passageDoors + +countsState.twinPassageDoors + +countsState.slidingDoors + +countsState.louverDoors + +countsState.twinLouvers + +countsState.twinSliders).toLocaleString("en-US"),
    pocketFrames: (+countsState.pocketDoors).toLocaleString("en-US"),
    steelFrames: (+countsState.commercialDoors + +countsState.twinCommercialDoors + +countsState.stairDoors + +countsState.heavyFireDoors + +countsState.twinHeavyFireDoors + +countsState.twinStairDoors).toLocaleString("en-US"),
    extensionJambs: ((+countsState.windowsThreeFT) + (+countsState.windowsSixFT * 1) + (+countsState.windowsNineFt * 2)).toLocaleString("en-US"),
    resBaseLF: (+countsState.baseBoard16 * 16).toLocaleString("en-US"),
    hallBaseLF: (0).toLocaleString("en-US"),
    doorCasingLF: ((((+countsState.privacyDoors + +countsState.passageDoors + +countsState.louverDoors + +countsState.pocketDoors + +countsState.slidingDoors + +countsState.entryDoors)*40)+((+countsState.twinLouvers + +countsState.twinPassageDoors + +countsState.twinSliders)*60)) + (+countsState.patioCasings * 20)).toLocaleString("en-US"),
    windowCasingLF: ((+countsState.windowsThreeFT * 20) + (+countsState.windowsSixFT * 26) + (+countsState.windowsNineFt * 32)).toLocaleString("en-US"),
    shoeLF: (+countsState.baseBoard16 * 16).toLocaleString("en-US"),
    windowSillLF: ((+countsState.windowsThreeFT * 3) + (+countsState.windowsSixFT * 6) + (+countsState.windowsNineFt * 9)).toLocaleString("en-US"),
    weatherStripLF: ((+countsState.entryDoors * 21) + (+countsState.stairDoors * 21) + (+countsState.heavyFireDoors * 21) + (+countsState.twinHeavyFireDoors * 21)).toLocaleString("en-US"),
    passageLocks: (+countsState.passageDoors + +countsState.twinPassageDoors + +countsState.louverDoors + +countsState.twinLouvers + +countsState.pocketDoors).toLocaleString("en-US"),
    privacyLocks: (+countsState.privacyDoors).toLocaleString("en-US"),
    sliderLocks: (+countsState.slidingDoors + (+countsState.twinSliders * 2)).toLocaleString("en-US"),
    panicLocks: (+countsState.stairDoors + ((+countsState.twinStairDoors + +countsState.twinHeavyFireDoors) * 2)).toLocaleString("en-US"),
    singlePanicDevices: (+countsState.stairDoors).toLocaleString("en-US"),
    verticalPanicDevices: ((+countsState.twinStairDoors + +countsState.twinHeavyFireDoors) * 2).toLocaleString("en-US"),
    entryLocks: (+countsState.entryDoors).toLocaleString("en-US"),
    deadBolts: (+countsState.entryDoors).toLocaleString("en-US"),
    baseDoorStops: (+countsState.entryDoors + +countsState.privacyDoors + +countsState.passageDoors + +countsState.twinPassageDoors + +countsState.louverDoors + +countsState.twinLouvers).toLocaleString("en-US"),
    wallDoorStops: (+countsState.commercialDoors + +countsState.twinCommercialDoors + +countsState.stairDoors + +countsState.heavyFireDoors + +countsState.twinHeavyFireDoors + +countsState.twinStairDoors).toLocaleString("en-US"),
    sliderTracks: (+countsState.slidingDoors + +countsState.twinSliders).toLocaleString("en-US"),
    sliderFloorGuides: (+countsState.slidingDoors + +countsState.twinSliders).toLocaleString("en-US"),
    resHinges: (((+countsState.privacyDoors + +countsState.passageDoors + +countsState.louverDoors)+((+countsState.twinLouvers + +countsState.twinPassageDoors)*2)) * 3).toLocaleString("en-US"),
    springHinges: (+countsState.entryDoors * 2).toLocaleString("en-US"),
    commercialHinges: (((+countsState.commercialDoors + +countsState.twinCommercialDoors + +countsState.stairDoors + +countsState.heavyFireDoors + +countsState.twinHeavyFireDoors + +countsState.twinStairDoors)*3) + +countsState.entryDoors).toLocaleString("en-US"),
    commercialClosers: (+countsState.commercialDoors + +countsState.twinCommercialDoors + +countsState.stairDoors + +countsState.heavyFireDoors + +countsState.twinHeavyFireDoors + +countsState.twinStairDoors).toLocaleString("en-US"),
    commercialLocks: (+countsState.commercialDoors + +countsState.twinCommercialDoors + +countsState.stairDoors + +countsState.heavyFireDoors + +countsState.twinHeavyFireDoors + +countsState.twinStairDoors).toLocaleString("en-US"),
    doorSilencers: '?',
    threeFTSills: (+countsState.entryDoors + +countsState.heavyFireDoors).toLocaleString("en-US"),
    sixFTSills: (+countsState.twinHeavyFireDoors).toLocaleString("en-US"),
    doorSweeps: ((+countsState.entryDoors + +countsState.heavyFireDoors) + (+countsState.twinHeavyFireDoors * 2)).toLocaleString("en-US"),
    peepSights: (+countsState.entryDoors).toLocaleString("en-US"),
    doorGuards: (+countsState.entryDoors).toLocaleString("en-US"),
    })
  }, [countsState])

  /*--FUNCS--*/

  //Dark mode logic. Pretty simple stuff.
    const DarkModeIconDecider =({darkToggle}) => {
      if (darkToggle == true) {
        return (
          <BsSunrise />
        )
      } else if (darkToggle == false) {
        return (
          <BsMoonStars />
          
        )
        
      } else {
        console.error('no boolean value for darkButtonToggle')
        return (<div>error</div>)
      }
    }
    const flipTheSwitch =() => {
      darkModeLightSwitch()
      if (darkButtonToggle == true) {
        setDarkButtonToggle(false)
      } else if (darkButtonToggle == false) {
        setDarkButtonToggle(true)
      } else {
        console.error('no boolean value for darkButtonToggle')
      }
       
    }


    const setChosenCursor = () => {
      proxySetChosenItemType('selectionToolButton')
      stampBackgroundColor.current = '#1a2d15'
    }

    //expandSideBar toggles on and off the 'extended' class to the sidebar & its button.
      const expandSideBar = (v) => {
        console.log(v)


        if (sideBarStatus.current == false) {
          document.getElementById('side-panel').classList.toggle('extended')
          document.getElementById('canvas-frame').classList.toggle('extended')
          document.getElementById('materialButton').classList.toggle('extended')
          document.getElementById('paletteButton').classList.toggle('extended')
          if (v == 'material') {
            setSelectedSideBar('material')
          }
          else if (v == 'palette') {
            setSelectedSideBar('palette')
          }
          sideBarStatus.current = true
        } else if (sideBarStatus.current == true) {
          if (v != selectedSideBar) {
            setSelectedSideBar(v)
          } else {
          setChosenCursor()
          document.getElementById('side-panel').classList.toggle('extended')
          document.getElementById('canvas-frame').classList.toggle('extended')
          document.getElementById('materialButton').classList.toggle('extended')
          document.getElementById('paletteButton').classList.toggle('extended')
          setSelectedSideBar('null')
          sideBarStatus.current = false
          
          }
          
        } else {console.error('idk what else to tell ya pal')}



      //   if (sideBarStatus.current == false) {
      //   document.getElementById('side-panel').classList.toggle('extended')
      //   document.getElementById('canvas-frame').classList.toggle('extended')
      //   sideBarStatus.current = true
      // } else {
      //   document.getElementById('side-panel').classList.toggle('extended')
      //   document.getElementById('canvas-frame').classList.toggle('extended')
      //   setChosenCursor()
      //   sideBarStatus.current = false
      // }
    }


    //Runs proxy func that passes button ID to App.js.
    const setChosenButton = (e) => {
        console.log(e.target.id)
        proxySetChosenItemType(e.target.id)
        
        let stampColor = ''
        switch(e.target.id) {
          case 'entryDoorsButton':
            stampColor = 'rgba(255, 0, 0, 0.4)'
        break;
        case 'privacyDoorsButton':
            stampColor = 'rgba(255, 251, 0, 0.4)'
        break;
        case 'passageDoorsButton':
            stampColor = 'rgba(136, 255, 0, 0.4)'
        break;
        case 'twinPassageDoorsButton':

            stampColor = 'rgba(38, 255, 0, 0.4)'
        break;
        case 'slidingDoorsButton':
            stampColor = 'rgba(0, 255, 68, 0.4)'
        break;
        case 'louverDoorsButton':
            stampColor = 'rgba(255, 174, 0, 0.4)'
        break;
        case 'steelDoorsButton':
            stampColor = 'rgba(255, 0, 221, 0.4)'
        break;
        case 'twinSteelDoorsButton':
            stampColor = 'rgba(221, 0, 255, 0.4)'
        break;
        case 'steelLiteDoorsButton':
            stampColor = 'rgba(255, 0, 149, 0.4)'
        break;
        case 'heavyFireDoorsButton':
            stampColor = 'rgba(255, 0, 76, 0.4)'
        break;
        case 'threeFootWindowsButton':
            stampColor = 'rgba(0, 255, 255, 0.4)'
        break;
        case 'sixFootWindowsButton':
            stampColor = 'rgba(0, 195, 255, 0.4)'
        break;
        case 'nineFootWindowsButton':
            stampColor = 'rgba(0, 140, 255, 0.4)'
        break;
        case 'patioCasingButton':
            stampColor = 'rgba(0, 255, 191, 0.4)'
        break;
        case 'twinLouverButton':
            stampColor = 'rgba(255, 191, 0, 0.4)'
        break;
        case 'twinSliderButton':
            stampColor = 'rgba(0, 255, 95, 0.4)'
        break;
        case 'pocketDoorButton':
            stampColor = 'rgba(154, 0, 255, 0.4)'
        break;
        case 'twinHeavyFireDoorButton':
            stampColor = 'rgba(255, 0, 60, 0.4)'
        break;
        case 'twinStairDoorButton':
            stampColor = 'rgba(255, 0, 155, 0.4)'

        break;
        case 'baseBoardVerticalButton':
            stampColor = 'rgba(122, 178, 25, 0.4)'
        break;
        case 'baseBoardHorizontalButton':
            stampColor = 'rgba(122, 178, 25, 0.4)'
        break;
        }
        stampBackgroundColor.current = stampColor

    }
    //setChosenCursor fires when the cursor button is pressed, and changes from stamp/stick selection to the cursor one.
    


    //Runs proxy func that sets the status of 'SAVING' to App
    const childProxySaveStatus = (val) => {
      saveButton()
      proxySaveStatus('SAVING')
    }

    //show/hide logic for scale <select> element
const openScaleInput =() => {
  if (scaleSelectToggle == false) {setScaleSelectToggle(true)}
  else {setScaleSelectToggle(false)}
  
}



//The different faces of the save button, based on saveStatus being 'SAVED', 'SAVING' or 'FAILED'
    const SaveButtonFunc = () => {
      if (saveStatus == 'SAVED') {
        return(
        <div className='header-button save' onClick={childProxySaveStatus}>
          <div className='darkModeButton'>
            <BsSdCard />
          </div>
          <div className='header-button-desc'>SAVE</div>
        </div>
        )
      }
      if (saveStatus == 'SAVING') {
        return(
        <div className='header-button save'>
          <div className='darkModeButton'>
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
          </div>
          <div className='header-button-desc'>SAVING..</div>
        </div>
        )
      }
      if (saveStatus == 'FAILED') {
        return(
        <div className='header-button save'>
          <div className='darkModeButton'>
          <BsEmojiFrown/>
          </div>
          <div className='header-button-desc'>FAILED</div>
        </div>
        )
      }
      
    }


    //Shows/hides the select input depending on the scaleSelectToggle state.
    const ScalingInterface =()=>{
      if(scaleSelectToggle == true) {
        return (
          <select className='scale-select' defaultValue={chosenBlueprintScale} onChange={setScale}>
            <option value={0.25}>1/4" = 1'0"</option>
            <option value={0.125}>1/8" = 1'0"</option>
            <option value={0.0625}>1/16" = 1'0"</option>
            <option value={0.03125}>1/32" = 1'0"</option>
          </select>
        )
      } else {
        <div>CLOSE</div>
      }
    }

    const MultiplierInputer = () => {
      if (multiSelectToggle) {
        if (multiSelectToggle == true) {
          return(
            <div className='header-button multi' id='selectionToolButton'>
            <div className='darkModeButton'>
          <input min={1} defaultValue={defaultMultiplierVal} className='multi-input' onChange={handleMultiplierChanger} type='number'></input>
          </div></div>
          )
        } else {
          return
        }
      } else {return}
      
    }


const MaterialPane = () => {
  return(
    <div id="materialPane" className='types-pane-wrapper' >
          <div className='type-box-wrapper top material' style={{backgroundColor: stampBackgroundColor.current}}>
              <div className='item-title'>Material List:</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Entry Slabs</div>
              <div className='item-counter material'>{materialsState.entrySlabs}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Residential Hollow Slabs</div>
              <div className='item-counter material'>{materialsState.resHollowSlabs}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Residential Solid Slabs</div>
              <div className='item-counter material'>{materialsState.resSolidSlabs}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Louver Slabs</div>
              <div className='item-counter material'>{materialsState.louverSlabs}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Steel Slabs</div>
              <div className='item-counter material'>{materialsState.steelSlabs}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Viewlite Slabs</div>
              <div className='item-counter material'>{materialsState.viewLiteSlabs}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Heavy Fire Slabs</div>
              <div className='item-counter material'>{materialsState.heavyFireSlabs}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Split Steel Frames</div>
              <div className='item-counter material'>{materialsState.entryFrames}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>FJP Frames</div>
              <div className='item-counter material'>{materialsState.resFrames}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Pocket Frames</div>
              <div className='item-counter material'>{materialsState.pocketFrames}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Hollow Metal Frames</div>
              <div className='item-counter material'>{materialsState.steelFrames}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Extension Jambs</div>
              <div className='item-counter material'>{materialsState.extensionJambs}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Unit Baseboard LF</div>
              <div className='item-counter material'>{materialsState.resBaseLF}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Hallway Baseboard LF</div>
              <div className='item-counter material'>{materialsState.hallBaseLF}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Door Casing LF</div>
              <div className='item-counter material'>{materialsState.doorCasingLF}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Window Casing LF</div>
              <div className='item-counter material'>{materialsState.windowCasingLF}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Shoe Molding LF</div>
              <div className='item-counter material'>{materialsState.shoeLF}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Window Sill LF</div>
              <div className='item-counter material'>{materialsState.windowSillLF}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Weather Stripping LF</div>
              <div className='item-counter material'>{materialsState.weatherStripLF}</div>
          </div>
          {/* <div className='type-box-wrapper material'>
              <div className='item-title material'>Shelving LF</div>
              <div className='item-counter material'>{materialsState.shelfLF}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Shelf Rod LF</div>
              <div className='item-counter material'>{materialsState.shelfRodLF}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Shelf Brackets</div>
              <div className='item-counter material'>{materialsState.shelfBrackets}</div>
          </div> */}
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Passage Locks</div>
              <div className='item-counter material'>{materialsState.passageLocks}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Privacy Locks</div>
              <div className='item-counter material'>{materialsState.privacyLocks}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Slider Pulls</div>
              <div className='item-counter material'>{materialsState.sliderLocks}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Panic Trim Levers</div>
              <div className='item-counter material'>{materialsState.panicLocks}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Rim Panic Devices</div>
              <div className='item-counter material'>{materialsState.singlePanicDevices}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Vertical Panic Devices</div>
              <div className='item-counter material'>{materialsState.verticalPanicDevices}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Entry Locks</div>
              <div className='item-counter material'>{materialsState.entryLocks}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Deadbolts</div>
              <div className='item-counter material'>{materialsState.deadBolts}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Base Door Stops</div>
              <div className='item-counter material'>{materialsState.baseDoorStops}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Wall Door Stops</div>
              <div className='item-counter material'>{materialsState.wallDoorStops}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Slider Tracks</div>
              <div className='item-counter material'>{materialsState.sliderTracks}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Slider Floor Guides</div>
              <div className='item-counter material'>{materialsState.sliderFloorGuides}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>3.5" Hinges</div>
              <div className='item-counter material'>{materialsState.resHinges}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>4.5" Spring Hinges</div>
              <div className='item-counter material'>{materialsState.springHinges}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>4.5" Commercial Hinges</div>
              <div className='item-counter material'>{materialsState.commercialHinges}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Commercial Closers</div>
              <div className='item-counter material'>{materialsState.commercialClosers}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Commercial Locks</div>
              <div className='item-counter material'>{materialsState.commercialLocks}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Door Silencers</div>
              <div className='item-counter material'>{materialsState.doorSilencers}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>3' Door Sill</div>
              <div className='item-counter material'>{materialsState.threeFTSills}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>6' Door Sills</div>
              <div className='item-counter material'>{materialsState.sixFTSills}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Door Sweeps</div>
              <div className='item-counter material'>{materialsState.doorSweeps}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Peep Sights</div>
              <div className='item-counter material'>{materialsState.peepSights}</div>
          </div>
          <div className='type-box-wrapper material'>
              <div className='item-title material'>Door Guards</div>
              <div className='item-counter material'>{materialsState.doorGuards}</div>
          </div>
        </div>
  )
}
const PalettePane = () => {
  return(
  <div id="palettePane" className='types-pane-wrapper'>
                <div className='type-box-wrapper top' style={{backgroundColor: stampBackgroundColor.current}}>
                    <div className='item-title'>Stamp Palette:</div>
                </div>
                <div id="entryDoorsButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>Entry Doors</div>
                    <div className='item-counter'>{countsState.entryDoors}</div>
                </div>
                <div id="louverDoorsButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>Louver Doors</div>
                    <div className='item-counter'>{countsState.louverDoors}</div>
                </div>
                <div id="twinLouverButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>2x Louver Doors</div>
                    <div className='item-counter'>{countsState.twinLouvers}</div>
                </div>
                <div id="privacyDoorsButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>Privacy Doors</div>
                    <div className='item-counter'>{countsState.privacyDoors}</div>
                </div>
                <div id="passageDoorsButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>Passage Doors</div>
                    <div className='item-counter'>{countsState.passageDoors}</div>
                </div>
                <div id="twinPassageDoorsButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>2x Pass Doors</div>
                    <div className='item-counter'>{countsState.twinPassageDoors}</div>
                </div>
                <div id="slidingDoorsButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>Sliding Doors</div>
                    <div className='item-counter'>{countsState.slidingDoors}</div>
                </div>
                <div id="twinSliderButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>2x Sliding Doors</div>
                    <div className='item-counter'>{countsState.twinSliders}</div>
                </div>
                <div id="pocketDoorButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>Pocket Doors</div>
                    <div className='item-counter'>{countsState.pocketDoors}</div>
                </div>
                <div id="threeFootWindowsButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>3/0 Window</div>
                    <div className='item-counter'>{countsState.windowsThreeFT}</div>
                </div>
                <div id="sixFootWindowsButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>6/0 Window</div>
                    <div className='item-counter'>{countsState.windowsSixFT}</div>
                </div>
                <div id="nineFootWindowsButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>9/0 Window</div>
                    <div className='item-counter'>{countsState.windowsNineFt}</div>
                </div>
                <div id="patioCasingButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>Patio Casing</div>
                    <div className='item-counter'>{countsState.patioCasings}</div>
                </div>
                
                <div id="steelDoorsButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>Steel Doors</div>
                    <div className='item-counter'>{countsState.commercialDoors}</div>
                </div>
                <div id="twinSteelDoorsButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>2x Steel Doors</div>
                    <div className='item-counter'>{countsState.twinCommercialDoors}</div>
                </div>
                <div id="steelLiteDoorsButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>Viewlite Doors</div>
                    <div className='item-counter'>{countsState.stairDoors}</div>
                </div>
                <div id="twinStairDoorButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>2x Viewlite Doors</div>
                    <div className='item-counter'>{countsState.twinStairDoors}</div>
                </div>
                <div id="heavyFireDoorsButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>+90MIN Label</div>
                    <div className='item-counter'>{countsState.heavyFireDoors}</div>
                </div>
                <div id="twinHeavyFireDoorButton" className='type-box-wrapper' onClick={setChosenButton}>
                    <div className='item-title'>2x +90MIN Label</div>
                    <div className='item-counter'>{countsState.twinHeavyFireDoors}</div>
                </div>
                <div className='type-box-wrapper baseboard'>
                    <div className='item-title'>16 FT Stick</div>
                    <div className='item-counter'>{countsState.baseBoard16} PCS</div>
                    <div className='option-button-wrapper'>
                    <div id="baseBoardHorizontalButton" onClick={setChosenButton} className='baseBoardOptionButton'>
                      <div className='BBOptionButton'><CgArrowsHAlt /></div>
                    </div>
                    <div id="baseBoardVerticalButton" onClick={setChosenButton} className='baseBoardOptionButton'>
                      <div className='BBOptionButton'><CgArrowsVAlt /></div>
                    </div>
                    </div>  
                </div>
            </div>
            )
}







const PaneSplitter = () => {
  if (selectedSideBar == 'null') {
    return(<div></div>)
  } else if (selectedSideBar == 'palette') {
    return(<PalettePane />)
  } else if (selectedSideBar == 'material') {
    return(<MaterialPane />)
  } else {return(<div>yer fekd bud</div>)}
}


    //
    //I won't dive deep into this..
    //The buttons up top are CI icons, and when you click their parent div they fire off their respective functions.
    //The buttons in the side panel change the chosen button state in App, which changes the stamp/stick.
    return (
        <div className='app-head'>
          <div className='header-button-bar one'>
            <div className='header-button dark-mode' onClick={flipTheSwitch}>
              <div className='darkModeButton'>
                <DarkModeIconDecider darkToggle={darkButtonToggle}/>
              </div>
              <div className='header-button-desc'>SWITCH</div>
            </div>
            <SaveButtonFunc />
            <div className='header-button scale' onClick={openScaleInput}>
              <div className='darkModeButton'>
                <RxRulerHorizontal />
              </div>
              <div className='header-button-desc'>SET SCALE</div>
            </div>
            <div className='header-button scaleSelect'>
              <div className='darkModeButton'>
              <ScalingInterface />
              </div>
            </div>
            
            <div className='header-button arrow-left' onClick={pageBack}>
              <div className='darkModeButton'>
                <BsArrowLeftCircle />
              </div>
              <div className='header-button-desc'>PAGE BACK</div>
            </div>
            <div className='header-button arrow-right' onClick={pageForward}>
              <div className='darkModeButton'>
                <BsArrowRightCircle />
              </div>
              <div className='header-button-desc'>PAGE NEXT</div>
            </div>
            <div className='header-button palette' id='paletteButton' onClick={()=>expandSideBar('palette')}>
              <div className='darkModeButton'>
                <BsPalette2 />
              </div>
              <div className='header-button-desc'>PALETTE</div>
            </div>
            
            <div className='header-button material' id='materialButton' onClick={()=>expandSideBar('material')}>
              <div className='darkModeButton'>
                <BsBoxSeam />
              </div>
              <div className='header-button-desc'>MATERIALS</div>
            </div>
            
                <MultiplierInputer />

          </div>
          <div id='side-panel' className=''>
            <PaneSplitter />
            
            {/* <SideBarHandler/> */}
          </div>
      </div>
    )

}

export default HeaderBar