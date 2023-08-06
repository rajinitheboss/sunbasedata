import React from "react";
import {useState,useEffect} from "react";
import instance from '../api/AxiosConfig';
import {FormEvent} from "react";
import { BearerToken } from "./SignIn";
import { useNavigate } from "react-router-dom";
import InputCustomer from "./InputCustomer";


function Home(){

    const [customerList,setCustomerList] = useState<any[]>([]);
    const [alertMessage,setAlertMessage] = useState<string>('');
    const navigate = useNavigate();
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [action,setAction] = useState<string>('');
    const [actedCustomer,setActedCustomer] = useState<any>(null);
    const [alertStatus,setAlertStatus] = useState<string>('none');

    if(BearerToken === undefined){
        navigate('/');
    }else if(BearerToken === ''){
        console.log('krishna');
        navigate('/');
    }else if(BearerToken === null){
        navigate('/');
    }


    useEffect(()=>{
        console.log('making call for all the customers');
        const fetchData = async() =>{
            const params={
                cmd:"get_customer_list"
            }
            try{
                console.log('getting customer data');
                setIsLoading(true);
                const response = await instance.get('/getcustomers',{
                    params:params,
                    headers:{
                        Authorization:"Bearer dGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM=",
                    }
                })
                setIsLoading(false);
                setCustomerList(response.data);
                console.log(response);
            }catch(e){
                console.log(e);
                setIsLoading(false);
                setAlertMessage('Unable to fetchData from the server');
            }
        }
        if(BearerToken !== ''){
            fetchData().then();
        }
    },[action])

    console.log(BearerToken);


    useEffect(()=>{
        const timerId = setTimeout(() => {
            setAlertMessage('');
        }, 8000);
        return ()=>clearTimeout(timerId);
    },[alertMessage])


    function handleDeleteClick(e:FormEvent<HTMLButtonElement>,i:number){
        setActedCustomer(customerList[i]);
        setAction('delete');
    }

    function handleUpdateClick(e:FormEvent<HTMLButtonElement>,i:number){
        setActedCustomer(customerList[i]);
        setAction('update');
    }

    function handleCreateClick(){
        console.log('doing a add click');
        setAction('add');
    }

    function handleCancelPopup(){
        setAction('none');
    }

    function handleDeletePopup(){
        const deleteCustomer = async() =>{
            const params={
                "cmd":"delete",
                "uuid":actedCustomer['uuid'],
            }
            try{
                setIsLoading(true);
                const response = await instance.post('/deletecustomer',{},{
                    params:params,
                    headers:{
                        Authorization: `Bearer ${BearerToken}`,
                    }
                })
                setAlertStatus('success');
                setAction('none');
                setAlertMessage('successfully deleted the customer');
                setIsLoading(false);
                if(response.status === 400){
                    console.log(response.data);
                    setAlertMessage('UUID not Found');
                }
            }catch(e){
                console.log(e);
                setAlertStatus('error');
                setIsLoading(false);
                setAction('none');
                setAlertMessage("Unable to delete the customer");
            }
        }
        deleteCustomer().then();
    }

    function takeAction(){
        if(action === 'update'){
            return(
                <div className='popup-overlay'>
                    <div className="popup-content">
                        <div style={{float:'right'}}>
                            <button onClick={handleCancelPopup}><i className="bi bi-x"/></button>
                        </div>
                        <InputCustomer action="update" customer={actedCustomer}/>
                    </div>
                </div>
            )
        }else if(action === 'add'){
            return (
                <div className='popup-overlay'>
                    <div className="popup-content">
                        <div style={{float:'right'}}>
                            <button onClick={handleCancelPopup}><i className="bi bi-x"/></button>
                        </div>
                        <InputCustomer action="add"/>
                    </div>
                </div>
            );
        }else if(action === 'delete'){
            return(
                <div className='popup-overlay'>
                    <div className="popup-content">
                        <div style={{float:'right'}}>
                            <button onClick={handleCancelPopup}> <i className="bi bi-x"/></button>
                        </div>
                        <h3>Are you sure you want to delete the customer</h3>
                        <div style={{float:'right'}}>
                            <button onClick={handleDeletePopup}> Delete </button>
                        </div>
                    </div>
                </div>
            )
        }
    }


    function alertMessageFunc(){
        if(alertStatus === 'success'){
            return(
                <div id='successAlert'>
                    {alertMessage}
                </div>
            )
        }
        else if(alertStatus === 'error'){
            return(
                <div id='errorAlert'>
                    {alertMessage}
                </div>
            )
        }
    }

    const arr = [];
    for(let i=0;i<customerList.length; i++){
        arr.push(
            <tr>
                <th scope='row'>{i+1}</th>
                <td>{customerList[i]['first_name']}</td>
                <td>{customerList[i].last_name}</td>
                <td>{customerList[i]['street']}</td>
                <td>{customerList[i]['address']}</td>
                <td>{customerList[i]['city']}</td>
                <td>{customerList[i]['state']}</td>
                <td>{customerList[i]['email']}</td>
                <td>{customerList[i]['phone']}</td>
                <td><button type={'button'} onClick={(e)=>handleUpdateClick(e,i)} style={{backgroundColor:'yellow'}}> update </button></td>
                <td><button type="button" onClick={(e)=>{handleDeleteClick(e,i)}} style={{backgroundColor:'red'}}> Delete </button></td>
            </tr>
        )
    }


    return(
        <div>
            {(isLoading)?<div className="loader"/>:
            <div style={{maxWidth:'100%', width:'100%',marginTop:'1.5rem'}}>
                <button style={{float : "left",backgroundColor:'blue'}} onClick= {handleCreateClick}> Add customer </button>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">street</th>
                            <th scope="col">address</th>
                            <th scope="col">city</th>
                            <th scope="col">state</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arr}
                    </tbody>
                </table>
                <div>
                    {alertMessageFunc()}
                </div>
                <>
                    {(action !== '')? takeAction():null}
                </>
            </div>
            }
        </div>
    )
}

export default Home;