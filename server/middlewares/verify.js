
const jwt= require('jsonwebtoken')


const usersOnly = (req,res,next)=>{
    jwt.verify(
        req.headers.authorization,
        process.env.TOKEN_SECRET, 
        (err, payload)=>{
        if(err){
            return res.status(401).send(err)
        }
        req.user = payload
        if (req.user.role !== "user"){
            return res.status(401).send({err:"only users can add to wish list"})
        }
        next()
    })
}

const adminsOnly = (req,res,next)=>{
    jwt.verify(
        req.headers.authorization,
        process.env.TOKEN_SECRET, 
        (err, payload)=>{
        if(err){
            return res.status(401).send(err)
        }
        req.user = payload
        if (req.user.role !== "admin"){
            return res.status(401).send({err:"access denied"})
        }
        next()
    })
}


const usersAndAdmins = (req,res,next)=>{
    jwt.verify(
        req.headers.authorization,
        process.env.TOKEN_SECRET, 
        (err, payload)=>{
        if(err){
            return res.status(401).send(err)
        }
        req.user = payload
        next()
    })
}

module.exports = {
    usersOnly,
    adminsOnly,
    usersAndAdmins
}




