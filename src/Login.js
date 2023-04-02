import { useState, useEffect, useRef } from "react";

const Login = ({setLoginAuth,baseUrl}) => {

//
//HOOKS
//
const [titleState, setTitleState] = useState('')
const formRef = useRef()
const loginCredentials = useRef()

//
//EFFECTS
//
useEffect(() => {
    loginCredentials.current = {
        docuType: '',
        userName: '',
        passWord: ''
    }
}, [])



//
//FUNCS
//

const setLoginCreds = async(e) => {
  setTitleState('waiting')
  e.preventDefault()
  document.getElementById('login-wrapper').classList.remove("denied")
  let userName = formRef.current[0].value
  let passWord = formRef.current[1].value
  console.log(userName, passWord)
  loginCredentials.current = {
      'docuType' : 'login',
      'userName' : userName,
      'passWord' : passWord
   }
   let parcelFormData = new FormData()
   parcelFormData.append("userName", formRef.current[0].value)
   parcelFormData.append("passWord", formRef.current[1].value)
   let dataCopy
   const res = await fetch(baseUrl + 'login/',
   {
       method: 'POST',
       body: parcelFormData
   })
   .then(result => result.json())
   .then(data => {
    console.log(data)
      setLoginAuth(data.response)
      dataCopy = data
      setTitleState('')
      console.log(data.response)
  });
  if (dataCopy.response == 'failure') {
    document.getElementById('login-wrapper').classList.add("denied")
  }
}


//
//RETURNS
//
  const TitleSplitter = () => {
    if (titleState == '') {
      return(
        <h1>LOGIN</h1>
      )
    } else if (titleState == 'waiting') {
      return(
        <h1>CONFIRMING..</h1>
      )
    } else {return(
      <div>PANIC</div>
    )}
  }

  return (
    <div className='tab-wrapper login'>
        <div id="login-wrapper">
            <TitleSplitter />
            <form ref={formRef} className="login-input-wrapper">
                <input className="login-input" type="text" placeholder="USERNAME"></input>
                <input className="login-input" type="password" placeholder="PASSWORD"></input>
                <button className="login-input" onClick={setLoginCreds}>Submit</button>
            </form>
            <div className="login-description">Can't log in? Contact Seb.</div>
        </div>
    </div>
)
}
export default Login

/*

*/
