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

            res.status(200).send({
                journeyID : saveBookmark.journeyID,
                userID : {
                    id : getUserDetails.id,
                    fullName : getUserDetails.fullName,
                    email : getUserDetails.email,
                    phone : getUserDetails.phone
                },
                message : "Bookmark added"
            })
        } else if(checkExist.journeyID === req.body.idJourney){
            var deleteBookmark = await Bookmark.destroy({
                where : {
                    id : checkExist.id
                }
            })

            return res.status(200).send({
                message : "Bookmark deleted"
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