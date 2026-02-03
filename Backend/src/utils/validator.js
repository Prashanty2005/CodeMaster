const validator=require("validator");

const validate= (data)=>{
    const mandatory= ['firstName','email','password'];
    const isAllowed= mandatory.every((k)=>Object.keys(data).includes(k));

    if(!isAllowed){
        throw new Error("fields missing");
    }

    if(!validator.isEmail(data.email))
        throw new Error("Invalid EmailID");
    if(!validator.isStrongPassword(data.password))
        throw new Error("password should be strong");
    
}


module.exports=validate;