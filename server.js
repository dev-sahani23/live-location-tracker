import { tunnel as cloudflaredTunnel } from "cloudflared";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import * as config from "./config.js";
import express, { urlencoded, json } from "express";
import { renderFile } from "tarkine";
import { createServer } from 'http';
import router from "./router.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const server = createServer(app)
const io = new Server(server)
const PORT = process.env.PORT || config.port
global.remoteURL

global.IO = io

app.set("view engine", "html")
app.engine("html", renderFile)
app.use(cookieParser())
app.use(urlencoded({ extended: false }))
app.use(express.static(__dirname + "/public"))
app.use(json())

app.use("/", router)

server.listen(PORT, async () => {
    const localURL = `http://localhost:${PORT}`
    global.remoteURL = await cloudflaredTunnel({
        "--url": localURL
    }).url

    console.log(`LOCAL  : ${localURL}`)
    console.log(`REMOTE : ${global.remoteURL}`)
})