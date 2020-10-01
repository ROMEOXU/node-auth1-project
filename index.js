const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('./config');
const Users = require('./user-model');
const usersMiddleware =  require('./restrict');
const server = express();
server.use(express.json());
const PORT = process.env.PORT || 5200;
server.use(session({
    resave:false,
    saveUninitialized:false,
    secret:'keep safe',
    store:new KnexSessionStore({
        knex:db,
        createtable:true,
    })
}))
server.use((err,req,res,next)=>{
    res.status(500).json({
        message:'sth went wrong'
    })
})


server.post('/api/login',async (req,res,next)=>{
    try{
      const {userName,passWord}= req.body
      const user = await Users.findBy({userName}).first()
     if(!user){
         return res.status(401).json({
             message:'invalid user'
         })
     }
     const passWordValid = await bcrypt.compare(passWord,user.passWord)
     if (!passWordValid){
        return res.status(401).json({
            message:'invalid user'
        })
     }
     req.session.user = user
     res.json({
         message:`welcome back ${user.userName}`
     })
    }catch(err){
     next(err)
    }
    

})

server.get('/api/users',usersMiddleware.restrict(),async (req,res,next)=>{
    try{
        res.json(await Users.find())
    }catch(err){
        next(err)
    }
})

server.post('/api/register',async (req,res,next)=>{
   try{
      const {userName,passWord}=req.body
      const user = await Users.findBy({userName}).first()
      if(user){
          return res.status(409).json({
              message:'user name already taken'
          })
      }
      const newUser = await Users.add({
          userName,
          passWord: await bcrypt.hash(passWord,10)
      })
      res.status(201).json(newUser)
   }catch(err){
       next(err)
   }
})

server.get('/api/logout',usersMiddleware.restrict(),async (req,res,next)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                next(err)
            }else{
                res.status(204).end()
            }
        })
    }catch(err){
        next(err)
    }
})
server.listen(PORT,()=>{
    console.log(`listen up on ${PORT}`)
})