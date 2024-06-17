require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        jwt.verify(token, process.env.SECRETKEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message:err.stack })
            } else {
                // console.log(decoded)
                req.userId = decoded.userId;
                next();
            }
        })
    } else {
        res.status(404).json({ message: 'please login ' })
    }
}

module.exports = {
    auth
}