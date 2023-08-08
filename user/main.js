import express from 'express' ;
import {config} from 'dotenv' ;
import bodyParser from 'body-parser'
config() ;

const app = express() ;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.USER_SERVER_PORT ;

app.get(`/`,(req,res)=>{
    return res.status(200).json({
        message : 'ok , up '
    })
});

app.post(`/data`,(req,res)=>{

    const {name} = req.body ;

    return res.status(200).json({
        message : `hello ${name || 'boss'}`
    })
});

app.get(`/data`,(req,res)=>{

    console.log(req.query)
    const name= req.query?.name ;

    return res.status(200).json({
        message : `hello ${name || 'boss'}`
    })
});

app.listen(PORT,()=>{
    console.log(` --- server is running on port ${PORT} --- `)
});