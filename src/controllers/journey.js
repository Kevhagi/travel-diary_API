const { Journey, User } = require('../../models')

exports.addJourney = async (req,res) => {
    try {
        const data = req.body

        let inputJourney = await Journey.create({
            title : data.title,
            desc : data.desc,
            userID : data.userId.id
        })

        res.status(200).send({
            id : inputJourney.id,
            title : inputJourney.title,
            userId : data.userId,
            desc : inputJourney.desc
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
                    desc : gura.desc
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
                    desc : gura.desc
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