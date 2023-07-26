const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

function verify(req, res, next){
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];

        jwt.verify(token, SECRET_KEY, (err,user)=>{
            if(err)  res.status(403).json("хүчингүй Токен !!");
            req.user = user;
            next();
        })
    }else{
        return res.status(401).json("Login хийнэ үү !!")
    }
}
function verify(req,res,next){
    const authHeader = req.headers.token
}
module.exports = verify;