const express=require('express')
require('dotenv').config()
// const  cors=require('cors')
const app=express()

// const auth=require('./routers/auth.js')


require('./db/conn')
 
 

const port=process.env.REACT_APP_PORT
console.log(process.env.REACT_APP_PORT);
// app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({extended:false}))
// app.use('/auth',auth)


  

 


 
app.listen(port,()=>{
console.log(`server is connected to ${port}`);
})

