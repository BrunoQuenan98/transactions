const { Router } = require('express');
const axios = require('axios');
const { User, Transaction } = require('../db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const router = Router();

const verifyUserBd = async (req, res, next) =>{
    const {email} = req.body;
    console.log(req.body);
    try{
    const user = await User.findAll({where:{email}});
    if(user.length){
        req.exists = true;
        req.user = user[0];
    }else{
        req.exists = false;
    }
    next();
    }catch(e){
        console.log(e.message);
        res.send("server error");
    }

}

const validateUser = async (req, res, next) =>{
    const { token } = req.headers;
    try{
    if(!token) return res.status(403).json('Not authorized');

    const payload = jwt.verify(token, 'my_secret_key');
    req.user = payload.user;
    next();
    }catch(e){
        console.error(e.message);
        res.send('Invalid token');
    }
}

router.post('/register',verifyUserBd ,async (req, res) =>{

    const {email, password} = req.body;
    const exists = req.exists;
    const user = req.user;
    const salt = await bcrypt.genSalt(10);

    if(exists){
        return res.json('User already exists');
    }else{
        bcrypt.hash(password, salt, async function(err, hash) {
                const userBd = await User.create({email, password: hash});
                const token = jwt.sign({user: email}, 'my_secret_key');
                res.json({ token });
            })
    }
    
});
router.post('/login',verifyUserBd ,async (req, res) =>{
    const {email, password} = req.body;
    const exists = req.exists;
    const user = req.user;
    

    if(exists){
        bcrypt.compare(password, user.password, function(err, result) {
            if(result){
               const token = jwt.sign({user: email}, 'my_secret_key');
                res.json({ token });
            }else if(!result){
                res.json('Credenciales invalidas');
            }
        });
    }else{
       res.json('No existe usuario con ese Mail');
    }
});

router.post('/transactions', validateUser, async (req, res) =>{

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
        res.send('error del servidor');
    }
});

router.get('/transactions', validateUser, async(req, res) =>{
    const user = req.user;
    try{
    const userBd = await User.findAll({where: {email : user}});
    const transactions = await Transaction.findAll({where:{userId:userBd[0].id},include:{model : User, attributes:["email"]}});
    return res.json(transactions);
    }catch(e){
        console.log(e.message);
        res.send("error en el servidor");
    }
});

router.get('/balance', validateUser, async(req,res) =>{
    const user = req.user;
    try{
    const userBd = await User.findAll({where: {email : user}});
    const transactions = await Transaction.findAll({where:{userId:userBd[0].id},include:{model : User, attributes:["email"]}});
    if(!transactions.length) return res.json(0);
    const balancePositive = transactions.filter(t =>t.type === 'ingreso').map(t => Number(t.amount)).reduce((prev, curr)=>prev+curr);
    const balanceNegative = transactions.filter(t =>t.type === 'egreso').map(t => Number(t.amount)).reduce((prev, curr)=>prev+curr);
    const balance = balancePositive - balanceNegative;
    return res.json(balance);
    }catch(e){
        console.log(e.message);
        res.send("error en el servidor");
    }
});




module.exports = router;
