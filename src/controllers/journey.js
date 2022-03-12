const { Journey, User } = require('../../models')

exports.addJourney = async (req,res) => {
    try {
        const data = req.body

        console.log(data.userID);

        let checkJourney = await Journey.findOne({
            where : {
                title : data.title
            }
        })
        if (checkJourney) {
            return res.status(400).send({
                message : "This title is already exist"
            })
        }

        let inputJourney = await Journey.create({
            ...data,
            image : req.file.filename
        })

        inputJourney = JSON.parse(JSON.stringify(inputJourney))

        inputJourney = {
            ...inputJourney,
            image : process.env.FILE_PATH + inputJourney.image
        }

        res.status(200).send({
            inputJourney
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message : "Server Error"
        })
    }
}

exports.getJourneys = async (req,res) => {
    try {
        var allJourneys = await Journey.findAll({
            order: [['updatedAt' , 'DESC']],
            include : [
                {
                    model : User,
                    required : true,
                    as : 'author',
                    attributes : {
                        exclude : ['password','image','createdAt','updatedAt']    
                    }
                }
            ]
        })

        res.status(200).send({
            data : allJourneys.map((gura, index) => {
                return {
                    id : gura.id,
                    title : gura.title,
                    author : gura.author,
                    desc : gura.desc,
                    updatedAt : gura.updatedAt
                }
            })
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message : "Server Error"
        })
    }
}

exports.getPostedJourneys = async (req,res) => {
    try {
        const {id} = req.params

        var allPosted = await Journey.findAll({
            where : {
                userID : id
            },
            include : [
                {
                    model : User,
                    required : true,
                    as : 'author',
                    attributes : {
                        exclude : ['password','image','createdAt','updatedAt']
                    }
                }
            ]
        })

        res.status(200).send({
            data : allPosted.map((gura, index) => {
                return {
                    id : gura.id,
                    title : gura.title,
                    author : gura.author,
                    desc : gura.desc,
                    updatedAt : gura.updatedAt
                }
            })
        })


    } catch (error) {
        console.log(error);
        res.status(400).send({
            message : "Server Error"
        })
    }
}