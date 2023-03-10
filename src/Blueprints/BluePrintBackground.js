import { useEffect, useState } from 'react'
import {Blocks} from "react-loader-spinner"

const BluePrintBackground = ({chosenPageIndex, pageCountArray, updateCanvasSizeImageDims, backgroundImageRef, darkMode}) => {

  //The only state needed lol. Hosts the image URL string.
  const [imageURL, setImageUrl] = useState()
    useEffect(() => {
        //This same logic is used three times over. onMount, pageCountArray, chosenPageIndex
        //What this does is grabs the integer of the page the user has paginated to.
        //Then it builds a URL using the ID of the image from google drive. These IDs are stored in pageCountArray
        //That image URL is stored in imageURL, and used in the <img> XML below.
        if (pageCountArray.length) {
          let indexInt = +chosenPageIndex
          let imgURLConstructur = 'https://drive.google.com/uc?export=view&id=' + (pageCountArray[indexInt].id)
          setImageUrl(imgURLConstructur)
        }
    }, [])

    useEffect(() => {
      if (pageCountArray.length) {
        let indexInt = +chosenPageIndex
        let imgURLConstructur = 'https://drive.google.com/uc?export=view&id=' + (pageCountArray[indexInt].id)
        setImageUrl(imgURLConstructur)
      }
    }, [pageCountArray])

    
    useEffect(() => {
      console.log('NEW')
      if (pageCountArray.length) {
        let imgURLConstructur = ''
        let indexInt = +chosenPageIndex
        if (!pageCountArray[indexInt]) {
          console.log('oops')
          imgURLConstructur = 'https://media.istockphoto.com/id/1152085853/vector/the-end-black-and-white-screen-background-movie-ending-screen-background-the-end-of-movie-or.jpg?s=612x612&w=0&k=20&c=LGB8716vyebM5f-u8Z54lj50J5Fk6bUabUoIK-IGvw4='

        } else {
        imgURLConstructur = 'https://drive.google.com/uc?export=view&id=' + (pageCountArray[indexInt].id)
        
        }
        setImageUrl(imgURLConstructur)
      }
    }, [chosenPageIndex])



    //Dark mode logic for the page itself.
    //When the switch is flipped, the page inverts its color, making it dark :)
    useEffect(() => {
      if (backgroundImageRef.current) {
        let darkModeBoolean = localStorage.getItem('darkOrLight')
        if (darkModeBoolean == 'dark') {
            backgroundImageRef.current.className = 'blueprintBackgroundImg dark'
        } else if (darkModeBoolean == 'light') {
            backgroundImageRef.current.className = 'blueprintBackgroundImg light'
        } else {
            localStorage.setItem('darkOrLight', 'dark')
        }
      }
        
        // console.log(darkModeBoolean)
    }, [darkMode])
    //More dumnb dark mode logic boo who cares
    //Short story: The program Stack which this emulates never had a light/dark mode. I requested one very early on in using it, but they never implemented it. Haha suckers.
    const onImageLoad = () => {
      updateCanvasSizeImageDims()
      let darkModeBoolean = localStorage.getItem('darkOrLight')
        if (darkModeBoolean == 'dark') {
            backgroundImageRef.current.className = 'blueprintBackgroundImg dark'
        } else if (darkModeBoolean == 'light') {
            backgroundImageRef.current.className = 'blueprintBackgroundImg light'
        } else {
            localStorage.setItem('darkOrLight', 'dark')
        }
    }
    
    //Once the page IDs are loaded, the <img> XML is set on.
    if (pageCountArray.length) {
      return (
        <img onLoad={onImageLoad} ref={backgroundImageRef} className='blueprintBackgroundImg dark' src={imageURL}></img>
    )
    } else {
      //Simple loading animation.
      return(
      <div className=''>
        <Blocks 
        height="50%"
        width="50%"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        />
      </div>)
    }
    

}

export default BluePrintBackground
