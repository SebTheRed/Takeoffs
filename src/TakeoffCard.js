import { useState, useEffect, useRef } from "react";

const TakeoffCard = ({takeoffInfo, assignTakeoffData}) => {
//
//HOOKS
//

const cardRef = useRef()
//
//EFFECTS
//

useEffect(() => {
  console.log(cardRef.current)
  if (takeoffInfo) {
    if (takeoffInfo[5] == "Unstarted") {
      cardRef.current.style.border = "2px solid red"
      console.log(cardRef.current)
    }
    else if (takeoffInfo[5] == "Incomplete") {
      cardRef.current.style.border = "2px solid orange"
      console.log(cardRef.current)
    } else {
      cardRef.current.style.border = "2px solid green"
    }
  }
    
}, [takeoffInfo])

//
//FUNCS
//

const setTakeoffData = () => {
  assignTakeoffData(takeoffInfo)
}

//
//RETURNS
//

 if (takeoffInfo) {
  return(
    <div className="card-wrapper" onClick={setTakeoffData}>
      <div ref={cardRef} className="card-info-wrapper image">
        <img className="card-image" src={takeoffInfo[7]}></img>
      </div>
      <hr style={{width: '90%'}}></hr>
      <div className="card-info-wrapper">
        <div className="card-info">Unit Count: {takeoffInfo[4]}</div>
        <div className="card-info">Company: {takeoffInfo[0]}</div>
        <div className="card-info">Name: {takeoffInfo[1]}</div>
        <div className="card-info">Address: {takeoffInfo[2]}</div>
        <div className="card-info">City,State: {takeoffInfo[3]}</div>
        <div className="card-info">Submittal is: {takeoffInfo[5]}</div>
      </div>
      
  </div>
  )
 }
  

}
export default TakeoffCard