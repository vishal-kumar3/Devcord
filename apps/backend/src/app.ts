import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from 'socket.io'
import { createAdapter } from "@socket.io/redis-streams-adapter";
import redis from "./config/redis.config.js";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json({
    limit: "20mb"
}))
app.use(express.urlencoded({ extended: true, limit: "20mb" }))
app.use(express.static("public"))
app.use(cookieParser())

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true
  },
  adapter: createAdapter(redis)
})


// importing routers
// import userRouter from "./routes/user.routes.js";

// declaring routes
// app.use("/api/v1/users", userRouter)

export { app, io, server }
