const bcrypt = require('bcryptjs');
const Users = require('./user-model');

function restrict(){
    const authErr = {
        message:'invalid credentials'
    }
return async (req,res,next)=>{
    try{
        if(!req.session || !req.session.user){
            return res.status(401).json(authErr)
        }
        next()
    }catch(err){
        next(err)
    }
}
   


}
module.exports = {
    restrict
}