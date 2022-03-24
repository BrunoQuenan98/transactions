const { validateUser, verifyUserBd } = require('./middlewares.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Router } = require('express');
const { User } = require('../db');

const router = Router();

router.get('/is-verify',validateUser,(req, res)=>{
    const user = req.user;
    try {
        if(user) return res.json(true);
        return res.json(false);
    } catch (error) {
        console.error(error.message);
        res.json('error del servidor');
    }
    

})

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

module.exports = router;