import { server, io } from "./app.js";

import dotenv from 'dotenv'
import { setupSocket } from "./socket.js";
dotenv.config({
  path: './.env'
})


setupSocket(io)


server.listen(process.env.PORT || 8000, () => {
  console.log(`server is running at ${process.env.PORT || 8000}`)
})
