import { tunnel as cloudflaredTunnel } from "cloudflared"
import cookieParser from "cookie-parser"
import { Server } from "socket.io"
import { port } from "./config"
import express, { urlencoded, json } from "express"
import { renderFile } from "tarkine"
import { createServer } from 'http'

const app = express()
const server = createServer(app)
const io = new Server(server)
const PORT = process.env.PORT || port
global.remoteURL

global.IO = io

app.set("view engine", "html")
app.engine("html", renderFile)
app.use(cookieParser())
app.use(urlencoded({ extended: false }))
app.use(express.static(__dirname + "/public"))
app.use(json())

app.use("/", require("./router"))

server.listen(PORT, async () => {
    const localURL = `http://localhost:${PORT}`
    remoteURL = await cloudflaredTunnel({
        "--url": localURL
    }).url

    console.log(`LOCAL  : ${localURL}`)
    console.log(`REMOTE : ${remoteURL}`)
})