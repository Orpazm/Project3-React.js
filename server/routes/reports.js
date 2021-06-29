
const router = require('express').Router()
const { adminsOnly } = require('../middlewares/verify');
const { myQuery } = require('../db');

router.get('/', adminsOnly, async (req,res)=>{
    try {
        const reports = await myQuery(`select connecter.*, vacations.destination, vacations.from_date,vacations.to_date,
        count(distinct user_id) as followers from vacations
        inner join connecter on connecter.vac_id = vacations.id group by vac_id`)
        res.status(200).send(reports)
    } catch (err) {
        res.status(500).send(err);
    }
} )








module.exports = router 