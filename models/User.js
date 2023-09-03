const {Schema,model}=require('mongoose')



const User = new Schema({
    username:{type: String, required: true},
    phone: {type: String},
    email: {type: String,required: true, unique:true},
    isAdmin:{type: Boolean, required: true},
    password: {type: String,required: true}
})

module.exports =model('User', User)
