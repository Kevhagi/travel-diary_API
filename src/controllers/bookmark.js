const { Bookmark, User, Journey } = require('../../models')

const jwt_decode = require('jwt-decode')

exports.handleBookmark = async (req,res) => {
    try {
        const token = req.header("Authorization")
        var decoded = jwt_decode(token)

        console.log(req.body.idJourney);

        var checkExist = await Bookmark.findOne({
            where : {
                userID : decoded.id,
                journeyID : req.body.idJourney
            }
        })

        console.log(checkExist);
        if (checkExist === null) {
            var saveBookmark = await Bookmark.create({
                userID : decoded.id,
                journeyID : req.body.idJourney
            })

            var getUserDetails = await User.findOne({
                where : {
                    id : decoded.id
                }
            })

            var getJourney = await Journey.findOne({
                where : {
                    id : req.body.idJourney
                }
            })

            res.status(200).send({
                journeyID : saveBookmark.journeyID,
                title : getJourney.title,
                userID : {
                    id : getUserDetails.id,
                    fullName : getUserDetails.fullName,
                    email : getUserDetails.email,
                    phone : getUserDetails.phone
                },
                message : `Journey "${getJourney.title}" added to your bookmark.`
            })
        } else if(checkExist.journeyID === req.body.idJourney){
            await Bookmark.destroy({
                where : {
                    id : checkExist.id
                }
            })

            var getJourneyDelete = await Journey.findOne({
                where : {
                    id : req.body.idJourney
                }
            })

            return res.status(200).send({
                message : `Journey "${getJourneyDelete.title}" deleted from your bookmark.`,
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message : "Server Error"
        })
    }
}

exports.getBookmarks = async (req,res) => {
    try {
        const {id} = req.params

        var allBookmarks = await Bookmark.findAll({
            where : {
                userID : id
            },
            order: [['updatedAt' , 'DESC']],
            include : [
                {
                    model : Journey,
                    as : 'journey',
                    include : [
                        {
                            model : User,
                            as : 'author'
                        }
                    ]
                }
            ]
        })

        res.status(200).send({
            data : allBookmarks.map((gura, index) => {
                return {
                    id : gura.id,
                    title : gura.journey.title,
                    author : {
                        id : gura.journey.author.id,
                        fullName : gura.journey.author.fullName,
                        email : gura.journey.author.email,
                        phone : gura.journey.author.phone
                    },
                    desc : gura.journey.desc,
                    journeyID : gura.journey.id,
                    image : process.env.FILE_PATH + gura.journey.image
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