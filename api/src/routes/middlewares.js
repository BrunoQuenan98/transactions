const { User } = require('../db.js');
const jwt = require('jsonwebtoken');

 const verifyUserBd = async (req, res, next) =>{
    const {email} = req.body;
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
        return res.json('Invalid token');
    }
}

 const verifyInputs = async (req,res,next) =>{

    const { concept , amount, date, type } = req.body;
    if(!concept) return res.json('Field concept incompleted');
    if(!amount) return res.json('Field amount incompleted');
    if(Number.isNaN(Number(amount))) return res.json('Only numbers can be included in Amount');
    if(!date) return res.json('Field date incompleted');
    if(!type) return res.json('Field type incompleted');

    next();
} 

module.exports = {verifyInputs , validateUser, verifyUserBd};