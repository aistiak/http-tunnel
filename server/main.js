import express from 'express';
import { config } from 'dotenv';
import http from 'http'
import { Server } from 'socket.io'
import bodyParser from 'body-parser'
config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.set('socketIo', io);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let connections = {}
const sockets = new Map()
app.get(`/`, (req, res) => {

    return res.sendStatus(200);
});



io.of('/').on('connection', (socket) => {
    try {
        // console.dir(e)
        socket.join(socket.id)
        connections[socket.id.toLowerCase()] = socket.id
        sockets.set(socket.id, socket)
        console.log(` a new user connected ${socket.id} `);
        // socket.emit('data', { 'message': 'hi there client' })
        // console.log({sockets : io.sockets.sockets})
    } catch (e) {
        console.log(e)
    }


});



app.get(`/connections`, (req, res) => {

    return res.status(200).json({ connections })
});

// app.all(`/tunnel*`, (req, res) => {
//     console.log('req.baseUrl' + req.hostname)
//     console.log(req.query)
//     // const id = req.query.id
//     const id = connections[req.hostname.split('.')[0].toLocaleLowerCase()]
//     // console.log({ connections })
//     console.log({ id })
//     console.log({ path: req.path })
//     if (!id) return res.sendStatus(404)
//     io.to(id).emit('data', {
//         message: `hello there ${id}`,
//         headers: req.headers,
//         body: req.body,
//         params: req.params,
//         query: req.query,
//         method: req.method,
//         path: req.path.replace('/tunnel', '')
//     })

//     sockets.get(id)?.on('update', (data) => {
//         console.log({ data })
//         sockets.get(id)?.removeListener('update', this);
//         return res.status(200).json(data)
//     })
//     // const data = await sockets.get(id)?.on('update')


// })

app.all(`/tunnel*`, (req, res) => {
    console.log('req.baseUrl' + req.hostname)
    console.log(req.query)
    const id = connections[req.hostname.split('.')[0].toLocaleLowerCase()];
    console.log({ id })
    console.log({ path: req.path })
    
    if (!id) return res.sendStatus(404);

    const updateListener = (data) => {
        console.log({ data });
        sockets.get(id)?.removeListener('update', updateListener);
        // res.status(200).json(data); // this also works 
        return res.status(200).json(data);
    };

    sockets.get(id)?.on('update', updateListener);

    io.to(id).emit('data', {
        message: `hello there ${id}`,
        headers: req.headers,
        body: req.body,
        params: req.params,
        query: req.query,
        method: req.method,
        path: req.path.replace('/tunnel', '')
    });
});


server.listen(process.env.SERVER_PORT, () => {
    console.log(` --- server started on port ${process.env.SERVER_PORT} ---`);
});