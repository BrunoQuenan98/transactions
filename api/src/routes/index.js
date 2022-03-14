const { Router } = require('express');
const axios = require('axios');
const { User } = require('../db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const router = Router();

const verifyUserBd = async (req, res, next) =>{
    const {username} = req.body;
    try{
    const user = await User.findAll({where:{username}})
    if(user.length){
        req.exists = true;
        req.user = user[0];
    }else{
        req.exists = false;
    }
    next();
    }catch(e){
        console.log('error en el middleware')
    }

}

const validateUser = async (req, res, next) =>{
    const { token } = req.headers;
    console.log(token)
    try{
    if(!token) return res.status(403).json('Not authorized');

    const payload = jwt.verify(token, 'my_secret_key');
    req.user = payload.user;
    next();
    }catch(e){
        console.error(e.message);
        res.send('Invalid token')
    }
}

router.post('/register',verifyUserBd ,async (req, res) =>{

    const {username, password} = req.body;
    const exists = req.exists;
    const user = req.user;
    const salt = await bcrypt.genSalt(10);

    if(exists){
        return res.json('User already exists')
    }else{
        bcrypt.hash(password, salt, async function(err, hash) {
                const userBd = await User.create({username, password: hash});
                const token = jwt.sign({user: username}, 'my_secret_key');
                res.json({ token })
            })
    }
    
})
router.post('/login',verifyUserBd ,async (req, res) =>{
    const {username, password} = req.body;
    const exists = req.exists;
    const user = req.user;
    

    if(exists){
        bcrypt.compare(password, user.password, function(err, result) {
            if(result){
               const token = jwt.sign({user: username}, 'my_secret_key');
                res.json({ token });
            }else if(!result){
                res.json('Credenciales invalidas')
            }
        });
    }else{
       res.json('No existe usuario con ese Mail')
    }
})

router.get('/transactions', validateUser, (req, res) =>{

    const user = req.user;
    res.json(user)

})




module.exports = router;
