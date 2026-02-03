const mongoose=require("mongoose");
const {Schema}= mongoose;


const userSchema= new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20,
    },
    lastName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        immutable:true,
    },
    age:{
        type:Number,
        min:6,
        max:80
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    problemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem'
        }],
        unique:true  //problemSolved should store unique value it should store problemId
    },
    password:{
        type:String,
        required:true
    }

},{timestamps:true});

//'findOneAndDelete' is attached only with 'findByIdAndDelete' of same model,when user is deleted
//all its data is stored in userInfo , and then this post condition is executed
//task is automated

//post is like it is bad me chalega
userSchema.post('findOneAndDelete',async function(userInfo){
    if(userInfo){
        await mongoose.model('submission').deleteMany({userId:userInfo._id});
    }
})


const user= mongoose.model("user",userSchema);

module.exports= user;