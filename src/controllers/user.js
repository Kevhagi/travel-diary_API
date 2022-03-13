const { User } = require('../../models')

const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.register = async (req,res) => {
    const schema = Joi.object({
        fullName : Joi.string().min(2).required(),
        email : Joi.string().min(6).email().required(),
        password : Joi.string().min(6).required(),
        phone : Joi.string().min(5).required()
    })

    const { error } = schema.validate(req.body)
    if(error){
        return res.status(400).send({
            error : {
                message : error.details[0].message
            }
        })
    }

    try {
        const checkUser = await User.findOne({
            where : {
                email : req.body.email
            }
        })
        if(checkUser !== null){
            return res.status(400).send({
                error : {
                    message : 'Email is already registered'    
                }
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const addUser = await User.create({
            fullName : req.body.fullName,
            email : req.body.email,
            password : hashedPassword,
            phone : req.body.phone
        })

        res.status(200).send({
            data : {
                id : addUser.id,
                email : addUser.email
            }
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message : "Server Error"
        })
    }
}

exports.login = async (req,res) => {

    const schema = Joi.object({
        email : Joi.string().min(6).email().required(),
        password : Joi.string().min(6).required()
    })

    const { error } = schema.validate(req.body)
    if(error){
        return res.status(400).send({
            error : {
                message : error.details[0].message
            }
        })
    }

    try {
        const checkUser = await User.findOne({
            where : {
                email : req.body.email
            }
        })
        if(checkUser === null){
            return res.status(400).send({
                error : {
                    message : 'Email is not registered'
                }
                
            })
        }

        const isValid = await bcrypt.compare(req.body.password, checkUser.password)
        if(!isValid) {
            return res.status(400).send({
                error : {
                    message : 'Credentials Error'    
                }
            })
        }

        const token = jwt.sign(
            {
                id : checkUser.id
            }, process.env.TOKEN_KEY
        )

        res.status(200).send({
            status : 'Success',
            data : {
                id : checkUser.id,
                token
            }
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status : 'Failed',
            message : 'Server Error'
        })
    }
}

exports.getUser = async (req,res) => {
    try {
        const id = req.params

        var userDetails = await User.findOne({
            where : id 
        })

        let image
        if (userDetails.image === null){
            image = null
        } else if (userDetails.image !== null) {
            image = process.env.FILE_PATH + userDetails.image
        }

        res.status(200).send({
            id : userDetails.id,
            fullName : userDetails.fullName,
            email : userDetails.email,
            phone : userDetails.phone,
            image
        })


    } catch (error) {
        console.log(error);
        res.status(400).send({
            message : "Server Error"
        })
    }
}

exports.checkAuth = async (req, res) => {
    try {
        const id = req.user.id;
  
        const dataUser = await User.findOne({
            where: {
                id
            }
        })
  
        if (!dataUser) {
            return res.status(400).send({
                message : "Auth not found"
            })
        }
  
        res.status(200).send({
            user: {
                id: dataUser.id
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            message: "Server Error"
        })
    }
};