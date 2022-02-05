import * as fs from "fs";
import * as http from "http";
import {Server} from "socket.io";
import express from "express";
import cors from "cors"
import * as axios from "axios";

const app = express();
const port = 3001
const server = http.createServer(app);
const usePromise = async (promise) => {
    try {
        const output = await promise;
        return [output, null]
    } catch (e) {
        return [null, e]
    }
}
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
app.set("json spaces", 2)
app.use(cors({
    origin: "*"
}));
app.get('/', (req, res) => {
    res.send('Hello World!')
});
app.get('/res', (req, res) => {
    res.json(JSON.parse(fs.readFileSync("D:\\Projects\\TeachMeToDance\\server\\src\\tiktok-res\\res.json")))
})
app.get("/video", (req, res) => {
    res.sendFile("D:\\Projects\\TeachMeToDance\\server\\dist\\tiktok-res\\download.mp4")
});

function getBase64(url) {
    return axios.get(url, {
        responseType: 'stream' || 'arraybuffer'
    }).then(r => r.data)
    // .then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

app.get("/img_/:url", async (req, res) => {
    // const images = [
    //     "https://m.media-amazon.com/images/M/MV5BMGUwZjliMTAtNzAxZi00MWNiLWE2NzgtZGUxMGQxZjhhNDRiXkEyXkFqcGdeQXVyNjU1NzU3MzE@._V1_UY1200_CR90,0,630,1200_AL_.jpg",
    //     "https://images.unsplash.com/photo-1491608159052-bcdd29d38b9c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bXklMjBsaWZlfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
    //     "https://images.unsplash.com/photo-1502759683299-cdcd6974244f?auto=format&fit=crop&w=440&h=220&q=60"
    // ];
    // const index = parseInt(req.params.index);
    const [stream, error] = await usePromise(getBase64(url))
    // const [stream, error] = await usePromise(getBase64(index > images.length ? images[Math.floor((Math.random()*images.length))] : images[index]));
    if (stream && !error) {
        stream.on("data", (a) => res.write(a));
        stream.on("end", () => res.end());
    } else res.end();
    // res.json("stream")
})
app.get("/img/:id?", async (req, res) => {
    const images = [
        {
            id: Math.random(),
            image: "https://m.media-amazon.com/images/M/MV5BMGUwZjliMTAtNzAxZi00MWNiLWE2NzgtZGUxMGQxZjhhNDRiXkEyXkFqcGdeQXVyNjU1NzU3MzE@._V1_UY1200_CR90,0,630,1200_AL_.jpg"
        },
        {
            id: Math.random(),
            image: "https://images.unsplash.com/photo-1502759683299-cdcd6974244f?auto=format&fit=crop&w=440&h=220&q=60"
        },
        {
            id: Math.random(),
            image: "https://images.unsplash.com/photo-1491608159052-bcdd29d38b9c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bXklMjBsaWZlfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
        }
    ];
    const index = parseInt(req.params.index);
    const found = images.find(image => image.id === req.params.id);
    res.json({
        next: images[Math.floor((Math.random() * images.length))].id,
        image: req.params.id && found ? found.image : (images[Math.floor((Math.random() * images.length))]).image
    })
    // res.json("stream")
})
io.on("connection", socket => {
    console.log("deviceConnected")
})
server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
