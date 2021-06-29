const router = require('express').Router()
const { myQuery } = require('../db');
const { usersAndAdmins, adminsOnly, usersOnly } = require('../middlewares/verify');
const moment = require('moment');



//showing all the vacations 
router.get('/', usersAndAdmins , async (req,res)=>{
    try {
        if(req.user.role == "user"){

            const vacations= await myQuery(`select * from vacations where vacations.id not in 
            (select vac_id from connecter where user_id = ${req.user.id})
            order by from_date`)
        
            const likedVacations= await myQuery(`select vacations.* , connecter.user_id, connecter.vac_id from users inner join connecter
            on users.id=connecter.user_id right join vacations on connecter.vac_id = vacations.id
            where connecter.user_id= ${req.user.id} order by from_date`)

            res.send({likedVacations,vacations})

        }else{

            const vacations= await myQuery(`select * from vacations
            order by from_date`)

            const likedVacations=[]

            res.send({likedVacations,vacations})
       
        }
    } catch (err) {
        res.status(500).send(err);
    }
})

//showing the user only his loved vacations
router.get('/favorites', usersOnly , async (req,res)=>{
    try {
            const likedVacations= await myQuery(`select vacations.* , connecter.user_id, connecter.vac_id from users 
            inner join connecter on users.id=connecter.user_id right join vacations on connecter.vac_id = vacations.id
            where connecter.user_id= ${req.user.id} order by from_date`)

            res.send(likedVacations)
 
    } catch (err) {
        res.status(500).send(err);
    }
})

//user adding vacations to favorites
router.post('/' , usersOnly, async (req,res)=>{
    const {user_id, vac_id} = req.body
    try {
        await myQuery(`INSERT INTO connecter (user_id, vac_id) VALUES ("${user_id}" , "${vac_id}")`)
        const vacations= await myQuery(`select * from vacations where vacations.id not in 
            (select vac_id from connecter where user_id = ${req.user.id})
            order by from_date`)
        
        const likedVacations= await myQuery(`select vacations.*, users.id , connecter.user_id from users inner join connecter
        on users.id=connecter.user_id left join vacations on vacations.id= connecter.vac_id 
        where connecter.user_id= ${req.user.id} order by from_date`)

         res.status(200).send({vacations,likedVacations})
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
})

//user deleting vacations from wish list
router.delete('/' , usersOnly, async (req,res)=>{

    const {id} = req.body

    try {
        await myQuery(`DELETE FROM connecter WHERE vac_id= '${id}'`)
        const vacations= await myQuery(`select * from vacations where vacations.id not in 
            (select vac_id from connecter where user_id = ${req.user.id})
            order by from_date`)
        
        const likedVacations= await myQuery(`select vacations.* , connecter.user_id, connecter.vac_id from users inner join connecter
        on users.id=connecter.user_id right join vacations on connecter.vac_id = vacations.id
        where connecter.user_id= ${req.user.id} order by from_date`)

         res.status(200).send({likedVacations,vacations})
    } catch (err) {
        res.status(500).send(err);
    }
})

//admin adding vacations
router.post('/admin' ,adminsOnly, async (req,res)=>{
    try {
        const {description, destination, from_date, to_date, price, img} = req.body

        if(!description || !destination || !from_date || !to_date || !price || !img){
            res.status(400).send("missing some info")
        }else{
            await myQuery(`INSERT INTO vacations (description,destination,from_date,to_date,price,img)
         VALUES ("${description}","${destination}","${from_date}","${to_date}","${price}","${img}")`)
         
        const vacations= await myQuery(`select * from vacations
        order by from_date`)

        const likedVacations= []
        res.status(200).send({likedVacations,vacations})  
        }
           
    } catch (err) {
        res.status(500).send(err);
    }
})

//admin deleting vacations
router.delete("/admin",adminsOnly, async(req,res)=>{

    try {
        const {id} = req.body
  
        await myQuery(`DELETE FROM vacations WHERE id= ${id} `)

        const vacations= await myQuery(`select * from vacations
        order by from_date`)
        
       const likedVacations= []
         res.status(200).send({likedVacations,vacations})
    } catch (err) {
        console.log(err)
        res.status(500).send({err})
    }
})

//admin changing vacations
router.put("/", adminsOnly, async(req,res)=>{
    const {id, description, destination, from_date, to_date, price, img} = req.body
    try {
        if(!description || !destination || !from_date || !to_date || !price || !img){
            res.status(400).send({err:"missing some info"})
        }else{
            await myQuery(`UPDATE vacations SET description= "${description}", destination= "${destination}",
            from_date= "${from_date}", to_date= "${to_date}", price= "${price}", img= "${img}" 
            WHERE id= ${id}`)

            const vacations= await myQuery(`select * from vacations
            order by from_date`)
        
            const likedVacations= []
            res.status(200).send({likedVacations,vacations})
        }
        
    } catch (err) {
        res.status(500).send(err)
    }
})



module.exports= router
