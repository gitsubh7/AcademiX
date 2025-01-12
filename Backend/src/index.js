import dotenv from "dotenv"
import {app} from "../src/app.js"
import {connectDB} from "../src/db/index.js"

dotenv.config()
const port = process.env.PORT || 8000


connectDB().
then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
        console.log(`URL : http://localhost:${port}`)
    })
}).catch((error)=>{
    console.log(error);
    
})
