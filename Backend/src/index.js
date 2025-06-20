import dotenv from "dotenv"
import {app} from "../src/app.js"
import {connectDB} from "../src/db/index.js"

dotenv.config()
const port = process.env.PORT || 8000


connectDB().
then(()=>{
    app.listen(port,()=>{
        console.log(`Server accessible at: https://academix-c07ol.onrender.com or http://localhost:${port} in local`);
    })
}).catch((error)=>{
    console.log(error);
    
})
