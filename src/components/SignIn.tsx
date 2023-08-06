import React from "react";
import {useState,FormEvent} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import instance from '../api/AxiosConfig';
import { useNavigate } from "react-router-dom";


let BearerToken = "";

function SignIn(){

    const [email,setEmail] = useState('');
    const [passWord,setPassWord] = useState('');
    // const [bearerToken,setBearerToken] = useState('');
    const [alertMessage,setAlertMessage] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e:FormEvent<HTMLButtonElement>){
        console.log('handling submit button');
        e.preventDefault();
        const data ={
            "login_id":email,
            "password":passWord,
        }
        const ApiCall = async() =>{
            try{
                console.log("making the api call");
                const response = await instance.post('/',data);
                console.log(response.data);
                BearerToken = response.data['access_token'];
                navigate('/home');
            }
            catch(e){
                setAlertMessage('Invalid Email or password');
            }
        }
        ApiCall().then();
    }



    return(
        <div className="popup-overlay">
            <div className='popup-content'>
                <form id= "signInForm">
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="email" className="form-control" id="email" onChange={(e)=>{setEmail(e.target.value)}} placeholder="Enter email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" onChange={(e)=>{setPassWord(e.target.value)}} id="password" placeholder="Password"/>
                    </div>
                    <div style={{placeItems:"center", marginTop:'0.5rem'}}>
                        <button type="button" style={{placeItems:"center"}} className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                    </div>
                    {(alertMessage === '')? null : <div className = 'errorMessage'> {alertMessage}</div>}
                </form>
            </div>
        </div>
    )
}

export {BearerToken};

export default SignIn;