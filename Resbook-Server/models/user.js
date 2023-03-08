const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true,
      
    },
    lname:{
        type:String,
        required:true,
       
      
    },
    email:{
        type:String,
        required:true,
      
     
},
password:{
    type:String,
   
    required:true,
    


},
cpassword:{
    type:String,
    required:true,
}
      
});
const User=new mongoose.model("User",UserSchema);
module.exports=User;