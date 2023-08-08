import axios from 'axios';
import {io }from 'socket.io-client' ;
const socket = io('http://localhost:3001/');
let USER_SERVER_URL = `http://localhost:3002`
socket.on('connect',()=>{
    console.log(` connected `)
    console.log(socket.id)
})
socket.on('data',async (data)=>{
    try {
        console.log(data)
        console.log(`--- data received ---`)
        // make axios request to listenting server 
        // get response 
        // emit response to socket 
        const { method , path , headers , params ,body , query} = data  ;
        console.log(`--- sending request --- `)
        console.dir({
            url : `${USER_SERVER_URL}${path}` ,
            method ,
            data : body ,
            headers ,
            params : query,
            query
        })
        const res = await axios({
            url : `http://localhost:3002${path}` ,
            method ,
            data : body ,
            // headers , // headers dont end the request for some reason
            params : query,
        })
        console.log(`--- response recived --- `)

        socket.emit('update',res.data)
    }catch(e){
        console.log(e)
        socket.emit('update',null)
    }

})