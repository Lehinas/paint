const express = require("express")
const config = require("config")
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const app = express()

const WSServer = require("express-ws")(app)
const aWss = WSServer.getWss()
const PORT = config.get("PORT") || 5000

app.use(express.json())
app.use(cors())

app.ws("/", (ws, req) => {
    ws.on("message", (msg) => {
        msg = JSON.parse(msg)
        switch(msg.method){
            case "connection":
                connectionHandler(ws, msg)
                break
            case "draw":
                noticeClientsHandler(ws, msg)
                break
        }
    })
})

app.post("/image", (req, res) => {
    try{
        const data = req.body.img.replace("data:image/png;base64,", "")
        fs.writeFileSync(path.resolve(__dirname, "images", `${req.query.id}.jpg`), data, "base64")
        return res.status(200).json("картина загружена")
    }catch (e){
        console.log(e)
        res.status(500).json("error in server")
    }
})

app.get("/image", (req, res) => {
    try {
        const imagePath = path.resolve(__dirname, "images", `${req.query.id}.jpg`)
        let file;
        if (fs.existsSync(imagePath)) {
            file = fs.readFileSync(imagePath)
            const data = "data:image/png;base64," + file.toString("base64")
            res.json(data)
        } else {
            file = fs.readFileSync(path.resolve(__dirname, "images", "default.jpg"))
            const data = "data:image/png;base64," + file.toString("base64")
            res.json(data)
        }

    } catch (e) {
        console.log(e);
        res.status(500).json("Error server")
    }
})


const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    noticeClientsHandler(ws, msg)
}

const noticeClientsHandler = (ws, msg) => {
    aWss.clients.forEach(client => {
        if(client.id === msg.id){
            client.send(JSON.stringify(msg))
        }
    })
}


app.listen(PORT,() => {
    console.log(`Server started on PORT: ${PORT}`)
})