const jwt = require('jsonwebtoken')

exports.auth = (req, res, next) => {
    const authHeader = req.header("Authorization")
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(400).send({
            message : "Access denied"
        })
    }

    try {
        const verify = jwt.verify(token, process.env.TOKEN_KEY)
        req.user = verify
        next()
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message : "Invalid token"
        })
    }
}