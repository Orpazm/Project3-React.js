const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken');
const { myQuery } = require('../db');



  router.post("/register", async (req, res) => {
    try {
      const { username, password, first_name, last_name } = req.body;
      // check missing info
      if (!username || !password || !first_name || !last_name) {
        return res.status(400).send({err:"missing some info"});
        }
      // username taken
        const user= await myQuery(`SELECT username from users WHERE username = '${username}'`)
          if(user.length >0){
            return res.status(400).send({err:"username is taken"})
        }
      // encrypt the password
      const hashedPass = await bcrypt.hash(password, 10);
      // save the user
      const data = await myQuery(`INSERT INTO users (first_name,last_name,username,password) 
      VALUES ("${first_name}","${last_name}","${username}","${hashedPass}")`)
     res.status(201).send({id:data.insertId});
    } catch (err) {
      res.status(500).send(err);
      console.log(err)
    }
  });


   router.post("/login", async (req,res)=>{
       try {
        const {username, password} = req.body
        const users= await myQuery(`SELECT * from users WHERE username = '${username}'`)
        //check missing info
        if (!username || !password){
            res.status(400).send({ err:"missing username or password" })
        }
        //user not found
        if (users.length == 0){
                return res.status(400).send({err:"user not found"})
        }
        //password doesn't match
        const isPasswordCorrect= await bcrypt.compare(password, users[0].password)
        if (! isPasswordCorrect){
                return res.status(400).send({err:"wrong password"})
            }
        //save to token
        const token = jwt.sign({
            id: users[0].id,
            username: users[0].username,
            first_name: users[0].first_name,
            role: users[0].role
        }, process.env.TOKEN_SECRET,
         {
             expiresIn:"20m"
        })
        res.send({token})
       } catch (err) {
          res.status(500).send(err)
       }
   })


module.exports = router 





