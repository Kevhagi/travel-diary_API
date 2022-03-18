const { Journey, User } = require('../../models')

const cloudinary = require('../utils/cloudinary');

exports.addJourney = async (req,res) => {
    try {
        const data = req.body

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

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'traveldiary',
            use_filename: true,
            unique_filename: true,
        });

        let inputJourney = await Journey.create({
            ...data,
            image : result.public_id
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

exports.deleteJourney = async (req,res) => {
    try {
        const {id} = req.params

        const findIndex = await Journey.findOne({
            where : {
                id
            }
        })
        if(findIndex === null){
            return res.status(400).send({
                status : 'Failed',
                message : 'ID not found'
            })
        } else if (findIndex !== null){
            await cloudinary.uploader.destroy(findIndex.image, function(error, result) {
                console.log(result, error);
            })

            await Journey.destroy({
                where : {
                    id
                }
            })

            res.status(200).send({
                message : `Journey "${findIndex.title}" successfully removed`
            })
        }

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

        allJourneys = JSON.parse(JSON.stringify(allJourneys));

        allJourneys = allJourneys.map((item) => {
            return { 
                ...item,
                image: process.env.FILE_PATH + item.image
            };
        });

        res.status(200).send({
            data : allJourneys.map((gura, index) => {
                return {
                    id : gura.id,
                    title : gura.title,
                    author : gura.author,
                    desc : gura.desc,
                    updatedAt : gura.updatedAt,
                    image : gura.image
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

exports.getJourney = async (req,res) => {
    try {
        const {id} = req.params

        var oneJourney = await Journey.findOne({
            where : {
                id
            },
            include : [
                {
                    model : User,
                    as : 'author',
                    attributes : {
                        exclude : ['password','image','createdAt','updatedAt']
                    }
                }
            ]
        })

        res.status(200).send({
            id : oneJourney.id,
            title : oneJourney.title,
            desc : oneJourney.desc,
            image : process.env.FILE_PATH + oneJourney.image,
            updatedAt : oneJourney.updatedAt,
            author : oneJourney.author
        })

    } catch (error) {
        console.log(error);
    }
}

exports.getPostedJourneys = async (req,res) => {
    try {
        const {id} = req.params

        var allPosted = await Journey.findAll({
            where : {
                userID : id
            },
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
            data : allPosted.map((gura, index) => {
                return {
                    id : gura.id,
                    title : gura.title,
                    author : gura.author,
                    desc : gura.desc,
                    updatedAt : gura.updatedAt,
                    image : process.env.FILE_PATH + gura.image
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

exports.editJourneyWithoutImage = async (req,res) => {
    try {
        const { id } = req.params

        const data = {
            title : req.body.title,
            desc : req.body.desc
        }

        await Journey.update(data, {
            where : {
                id
            }
        })

        res.status(200).send({
            message : `Journey ${id} successfully updated`
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            message : "Server Error"
        })
    }
}

exports.editJourney = async (req,res) => {
    try {
        const { id } = req.params

        const search = await Journey.findOne({
            where : {
                id
            }
        })

        if (search.image !== null){
            await cloudinary.uploader.destroy(search.image, function(error, result) {
                console.log(result, error);
            })
        }

        /* remove image locally use fs & path
        const removeImage = (filePath) => {
            filePath = path.join(__dirname, '../../uploads/', filePath)
            fs.unlink(filePath, err => console.log(err))
        }
        removeImage(search.image)
        */

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'traveldiary',
            use_filename: true,
            unique_filename: true,
        });

        const data = {
            title : req.body.title,
            desc : req.body.desc,
            image : result.public_id
        }

        await Journey.update(data, {
            where : {
                id
            }
        })

        res.status(200).send({
            message : `Journey ${id} successfully updated`
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            message : "Server Error"
        })
    }
}
