const express = require("express")
const cors = require("cors")
const http = require("http")
const app = express()
const dotenv = require("dotenv")
const server = http.createServer(app)
const {Server} = require("socket.io")

//middlewares
app.use(cors())
dotenv.config()

//routes
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {   
    console.log("a user connected ", socket.id)
    socket.on("join_room", (data) => {
        socket.join(data.room)
        console.log(`User ${data.name} joined room: `, data.room)
    })
    socket.on("send_message", (data) => {
        console.log(data)
        socket.to(data.room).emit("receive_message", data)
    })
    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id)
    })
})


server.listen(process.env.PORT || 5000, () => {
    console.log("Server is running")
})
