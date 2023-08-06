
const express = require('express');

const app = express();

const instance = require('../server/api/axiosConfig');
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../build')));
const buildPath = path.join(__dirname, '../build');

app.get('/',(req,res)=>{
    res.sendFile(path.join(buildPath,'/index.html'));
})

app.get('/home',(req,res)=>{
    res.sendFile(path.join(buildPath,'/index.html'));
})

app.use(bodyParser.json());
app.post('/api/',(req,res)=>{
    console.log('hitting authentication');
    console.log(req.data);
    console.log(req.body);
    const authentication = async() =>{
        try{
            const response = await instance.post('/assignment_auth.jsp',req.body,{
                params:req.query,
                headers:{
                    Authorization: req.headers.authorization,
                }
            })
            res.send(response.data);
        }catch(e){
            // console.log(e);
            res.status(400).send('unable to delete the customer');
        }
    }
    authentication().then();
})

app.get('/api/getcustomers',(req,res)=>{
    const fetchData = async()=>{
        try{
            console.log(req.query);
            console.log(req.headers);
            const response = await instance.get('/assignment.jsp',{
                params:{
                    cmd : "get_customer_list"
                },
                headers:{
                    'Authorization': req.headers.authorization,
                },
            })
            res.send(response.data);
        }
        catch(e){
            console.log(e.reason);
            res.status(400).send("unble to fetch data");
        }   
    }
    fetchData().then();
})
app.post('/api/deletecustomer',(req,res)=>{
    const deleteCustomer = async() =>{
        try{
            const response = await instance.post('/assignment.jsp',{},{
                params:req.query,
                headers:{
                    Authorization: req.headers.authorization,
                }
            })
            res.send(response.data);
        }catch(e){
            console.log(e);
            res.status(400).send('unable to delete the customer');
        }
    }
    deleteCustomer().then();
})


app.post('/api/updatecustomer',(req,res)=>{
    const updatecustomer = async() =>{
        try{
            console.log('hitting update customer');
            console.log(req.body);
            console.log(req.query);
            console.log(req.headers.authorization);
            const response = await instance.post('/assignment.jsp',req.body,{
                params:req.query,
                headers:{
                    Authorization: req.headers.authorization,
                }
            })
            res.send(response.data);
        }catch(e){
            // console.log(e);
            console.log('some error ');
            // console.log(e.response);
            res.status(400).send('unable to update the customer');
        }
    }
    updatecustomer().then();
})

app.post('/api/addcustomer',(req,res)=>{
    const updatecustomer = async() =>{
        try{
            const response = await instance.post('/assignment.jsp',req.body,{
                params:req.query,
                headers:{
                    Authorization: req.headers.authorization,
                }
            })
            res.send(response.data);
        }catch(e){
            console.log(e);
            res.status(400).send('unable to add the customer');
        }
    }
    updatecustomer().then();
})


app.listen(port,()=>{
    console.log('server is running');
});