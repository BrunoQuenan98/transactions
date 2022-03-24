const { Router } = require('express');
const { validateUser, verifyInputs } = require('./middlewares.js');
const { User, Transaction } = require('../db.js');

const router = Router();

router.post('/', validateUser, verifyInputs, async (req, res) =>{

    const user = req.user;
    const { concept , amount, date, type } = req.body;
    try{
        console.log(user);
    const userBd = await User.findAll({where: {email : user}});
    const transaction = await Transaction.create({ concept , amount, date, type });
    await transaction.setUser(userBd[0].id);
    res.json(transaction);
    }catch(e){
        console.error(e.message);
        res.json('Error del servidor');
    }
});

router.get('/', validateUser, async(req, res) =>{
    const user = req.user;
    try{
    const userBd = await User.findAll({where: {email : user}});
    const transactions = await Transaction.findAll({
        where:{
            userId:userBd[0].id
        },
        include:{
            model : User, attributes:["email"]
        }, 
        order:[
        ['id', 'ASC']
    ],});
    return  transactions.length ? res.json(transactions.slice(0,10)) : res.json(transactions);
    }catch(e){
        console.log(e.message);
        res.send("error en el servidor");
    }
});

router.delete('/:id', validateUser, async(req,res) =>{
    const { id } = req.params;
    try {
        await Transaction.destroy({
            where: {
              id,
            },
          });
          res.json({removed : true});
    } catch (e) {
        console.log(e.message);
        res.json('error en el servidor')
    }
})

router.put('/:id', validateUser, async(req,res) =>{
    const { id } = req.params;
    console.log(req.params);
    try {
        const updateTransaction = await Transaction.update(req.body, {
            where: {
              id,
            },
            returning: true,
          });
          return res.json(updateTransaction[1]);
    } catch (error) {
        console.log(error.message);
        return res.json('error del servidor');
    }
    
      
})

router.get('/balance', validateUser, async(req,res) =>{
    const user = req.user;
    try{
    const userBd = await User.findAll({where: {email : user}});
    const transactions = await Transaction.findAll({where:{userId:userBd[0].id},include:{model : User, attributes:["email"]}});
    if(!transactions.length) return res.json(0);
    let balancePositive = transactions.filter(t =>t.type === 'ingreso');
    balancePositive = balancePositive.length ? balancePositive.map(t => Number(t.amount))?.reduce((prev, curr)=>prev+curr) : 0;
    let balanceNegative = transactions.filter(t =>t.type === 'egreso');
    balanceNegative = balanceNegative.length ? balanceNegative.map(t => Number(t.amount))?.reduce((prev, curr)=>prev+curr) : 0;
    const balance = balancePositive - balanceNegative;
    return res.json(balance);
    }catch(e){
        console.log(e.message);
        res.send("error en el servidor");
    }
});

module.exports = router;