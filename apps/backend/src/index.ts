import { app } from "./app.js";

import dotenv from 'dotenv'
dotenv.config({
  path: './.env'
})


app.listen(process.env.PORT || 8000, () => {
  console.log(`server is running at ${process.env.PORT || 8000}`)
})


/*
;( async () => {
    try{
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("Error: ", error)
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })

    }
    catch(error){
        console.log("Error: ", error)
        throw error
    }
})()

*/
