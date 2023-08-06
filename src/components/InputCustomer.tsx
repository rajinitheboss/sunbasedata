import React from "react";
import {useState,useEffect} from "react";
import { FormEvent,ChangeEvent } from "react";
import instance from '../api/AxiosConfig';
import {BearerToken} from "./SignIn";
import './InputCustomer.css';
import { useNavigate } from "react-router-dom";


interface InputCustomerProps{
    customer?:any
    action:string
}

function InputCustomer(props:InputCustomerProps){
    const [firstName,setFirstName] = useState<string>('');
    const [lastName,setLastName] = useState<string>("");
    const [street,setStreet] = useState<string>('');
    const [address,setAddress] = useState<string>('');
    const [city,setCity] = useState<string>('');
    const [state,setState] = useState<string>('');
    const [email,setEmail] = useState<string>('');
    const [phone,setPhone] = useState<string>('');
    const navigate = useNavigate();
    const [alertMessage,setAlertMessage] = useState<string>('');
    const [alertStatus,setAlertStatus] = useState<string>('none');

    useEffect(()=>{
        if(props.customer !== undefined){
            setFirstName((props?.customer as any).first_name);
            setLastName(props.customer['last_name']);
            setStreet(props.customer['street']);
            setAddress(props.customer['address']);
            setCity(props.customer['city']);
            setState(props.customer['state']);
            setEmail(props.customer['email']);
            setPhone(props.customer['phone']);
        }
    },[props])


    function handleChange(e:ChangeEvent<HTMLInputElement>){
        e.preventDefault();
        const id = e.target.id;
        const value = e.target.value;
        switch(id){
            case 'firstName':
                setFirstName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'street':
                setStreet(value);
                break;
            case 'address':
                setAddress(value);
                break;
            case 'city':
                setCity(value);
                break;
            case 'state':
                setState(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            default:
                console.log('something is wrong');
        }
    }

    function handleSubmitClick(e:FormEvent<HTMLButtonElement>){
        e.preventDefault();
        if(firstName === '' || lastName===''){
            setAlertMessage('first name and last name are required fields');
            setAlertStatus('error');
        }
        const data = {
            "first_name": firstName,
            "last_name": lastName, 
            "street": street, 
            "address": address,
            "city": city,
            "state": state,
            "email": email, 
            "phone": phone,
        }
        if(props.action === 'add'){
            if(firstName=== '' || lastName ===''){
                setAlertMessage('first name and last name should not be empty');
                setAlertStatus('error');
            }
            else{
                const params={
                    cmd:"create"
                }
                const addCustomer = async()=>{
                    try{
                        const response = await instance.post('/addcustomer',data,{
                            params:params,
                            headers:{
                                Authorization:`Bearer ${BearerToken}`
                            }
                        })
                        console.log("response",response);
                        setAlertMessage('Successfully added customer');
                        setAlertStatus('success');
                    }catch(e){
                        console.log(`Error in adding customer`,e);
                        setAlertMessage('Error while adding the customer');
                        setAlertStatus('error');
                    }
                }
                addCustomer().then();
            }
        }
        else if(props.action==="update"){
            const params={
                cmd:"update",
                uuid:`${props.customer['uuid']}`
            }
            const updateCustomer = async()=>{
                try{
                    const response = await instance.post('/updatecustomer',data,{
                        params:params,
                        headers:{
                            Authorization:`Bearer ${BearerToken}`
                        }
                    })
                    console.log("response",response);
                    setAlertMessage('Successfully updated customer');
                    setAlertStatus('success');
                }catch(e:any){
                    console.log(`Error in adding customer`,e);
                    if(e.status === 500){
                        setAlertMessage('invalid UUID');
                    }
                    else{
                        setAlertMessage('Error while updating the customer');
                        setAlertStatus('error');
                    }
                }
            }
            updateCustomer().then();
        }
    }

    function handleCancelClick(e:React.MouseEvent){
        e.preventDefault();
        setAlertStatus('none');
    }
    function alert(){
        switch(alertStatus){
            case 'success':
                return(
                    <div>
                        <div id="successAlert" style={{display:'inline'}}>
                            {alertMessage}
                        </div>
                        <button style={{float:"right"}} onClick={handleCancelClick}> <i className="bi bi-x"></i> </button>
                    </div>
                )
            case "error":
                return(
                    <div>
                        <div id='errorAlert' style={{display:'inline'}}>
                            {alertMessage}
                        </div>
                        <button style={{float:"right"}} onClick={handleCancelClick}> <i className="bi bi-x"></i> </button>
                    </div>
                )
            default:
                return null;
        }
    }

    return(
        <div>
            <form>
                <div className="form-row">
                    <label htmlFor="firstName" className="col-sm-2">First Name</label>
                    <div className="col-sm-10">
                    <input type="text" id = 'firstName' value={(firstName!=='')?firstName:undefined} className="form-control" onChange={handleChange} placeholder="First name"/>
                    </div>
                </div>
                <div className='form-row'>
                    <div className="col">
                    <label htmlFor="lastName">Last Name</label>
                        <input type="text" id = 'lastName' value={(lastName!=='')?lastName:undefined} className="form-control" onChange={handleChange} placeholder="Last name"/>
                    </div>
                </div>
                <div className = "form-row">
                    <div className = "col">
                        <label htmlFor="street">street </label>
                        <input type="text" id = 'street' value={(street!=='')?street:undefined}className="form-control" onChange={handleChange} placeholder = "street"/>
                    </div>
                    <div className = "col">
                        <label htmlFor="address">address</label>
                        <input type="text" id='address' value={(address!=='')?address:undefined}className = "form-control" onChange={handleChange} placeholder = "address"/>
                    </div>
                </div>
                <div className = "form-row">
                    <div className = "col">
                        <label htmlFor="city" style={{display:"inline"}}>city</label>
                        <input type="text" id='city' value={(city!=='')?city:undefined} className="form-control" onChange={handleChange} placeholder = "city"/>
                    </div>
                    <div className = "col">
                        <label htmlFor="state">state</label>
                        <input type="text" id='state' value={(state!=='')?state:undefined} className = "form-control" onChange={handleChange} placeholder = "state"/>
                    </div>
                </div>
                <div className = "form-row">
                    <div className = "col">
                        <label htmlFor='email'> Email </label>
                        <input type="email" id='email' value={(email!=='')?email:undefined} className="form-control" onChange={handleChange} placeholder = "Email"/>
                    </div>
                    <div className = "col">
                        <label htmlFor='phone'> phone </label>
                        <input type="text" id='phone' value={(phone!=='')?phone:undefined} className = "form-control" onChange={handleChange} placeholder = "phone"/>
                    </div>
                </div>
                <div>
                    <button type='button' onClick={handleSubmitClick}>{props.action}</button>
                </div>
            </form>
            <>
                {(alertStatus !== 'none')? alert():null}
            </>
        </div>
    )
}

export default InputCustomer;