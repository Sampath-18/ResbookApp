const mongoose=require('mongoose')
// require('dotenv').config()
// console.log(process.env.REACT_APP_DATABASE);
const DB=process.env.REACT_APP_DATABASE
mongoose.connect(DB,{useNewUrlParser:true,}).then(()=>{
    console.log(`you are successfully conected to the database`);
}).catch((err)=>{
    console.log(err);
})