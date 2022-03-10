const { Bookmark, User, Journey } = require('../../models')

const jwt_decode = require('jwt-decode')

exports.addBookmark = async (req,res) => {
    try {
        const token = req.header("Authorization")
        var decoded = jwt_decode(token)

        var checkExist = await Bookmark.findAll({
            where : {
                userID : decoded.id,
                journeyID : req.body.idJourney
            }
        })
        if(checkExist){
            return res.status(400).send({
                message : "This bookmark is already in your list"
            })
        }

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
            }
        })
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
                    model : User,
                    as : 'user'
                },
                {
                    model : Journey,
                    as : 'journey'
                }
            ]
        })

        res.status(200).send({
            data : allBookmarks.map((gura, index) => {
                return {
                    id : gura.id,
                    title : gura.journey.title,
                    userID : {
                        id : gura.user.id,
                        fullName : gura.user.fullName,
                        email : gura.user.email,
                        phone : gura.user.phone
                    },
                    desc : gura.journey.desc
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