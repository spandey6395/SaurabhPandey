
const { flat } = require('mongoose/lib/helpers/query/validOps')
const { object } = require('mongoose/lib/utils')
const AuthorModel = require('../models/AuthorModel')
const BlogModel = require('../models/BlogModel')



//----------------Create Blog POST /blogs

const CreateBlog = async function (req, res) {

    try {


        let blog = req.body
        
        if (Object.keys(blog).length != 0) {

            if (req.body.author_id == null) {
                return res.status(404).send("author_id is required ")
            }
            else {
                if (req.body.author_id) {
                    const isAuthor = await AuthorModel.findOne({ _id: req.body.author_id })
                    if (!isAuthor) return res.status(400).send("Entered authorId is not valid")
                }

            }

            let { title, body, author_id, tags, category, subcategory } = blog

            if (!title) {
                return res.status(400).send({ message: "Title is required" })
            }

            if (!body) {
                return res.status(400).send({ message: "body is required" })
            }

            if (!author_id) {
                return res.status(400).send({ message: "author_id is required" })
            }

            if (!tags) {
                return res.status(400).send({ message: "Tags is required" })
            }

            if (!category) {
                return res.status(400).send({ message: "Category is required" })
            }

            if (!subcategory) {
                return res.status(400).send({ message: "Subcategory is required" })
            }

            let BlogCreated = await BlogModel.create(blog)
            res.status(201).send({status:true,msg:"Blog created successfully" ,data: BlogCreated })
        }
        else {
            res.status(400).send({ message: "BAD invalid request" });
        }

    }
    catch (err) {
        res.status(400).send({ msg: "Error", ERROR: err.message })
    }

}








//----------------Getblog/GET /blogs



const getBlog = async function (req, res) {
    try {

        let data = req.query
        if (data) {
            let blogs = await BlogModel.find({ isDeleted: false, isPublished: true, $or: [{ author_id: data.author_id }, { category: data.category }, { tags: data.tags }, { subcategory: data.subcategory }] }).populate('author_id')
            if (!blogs.length) res.status(404).send({ status: false, msg: "not found" })
            res.status(200).send({ status: true, data: blogs })
        }

    } catch (err) {

        res.status(404).send({ status: false, msg: "NOT FOUND", ERROR: err.message });
    }
}









//-----------------UpdateBlog/PUT /blogs/:blogId



const UpdateBlog = async function (req, res) {

    try {
        if ((typeof (req.body.title) != "string" && typeof (req.body.title) != "undefined") || (typeof (req.body.body) != "string" && typeof (req.body.body) != "undefined") || (typeof (req.body.isPublished) != "boolean" && typeof (req.body.isPublished) != "undefined") || (typeof (req.body.tags) != "string" && typeof (req.body.tags) != "undefined") || (typeof (req.body.subcategory) != "string" && typeof (req.body.subcategory) != "undefined")) {
            return res.status(400).send({ status: false, msg: "invalid input" })
        }

         let id = req.params.blogId;

        let blog = req.body

        if (Object.keys(blog).length == 0) {
            res.status(404).send({ status: false, msg: "Data Required in body field" })
        }

        if (req.body.isPublished == true) {
            req.body.isPublished = true
            req.body.publishedAt = new Date()
        }

        const update = await BlogModel.findByIdAndUpdate({ _id: id, isDeleted: false }, { $set: req.body }, { new: true })
        res.status(201).send({ status: true, Msg: update })
    } catch (err) {
        res.status(400).send({ status: false, MSG: err.message })
    }

}






//---------------DELETE /blogs/:blogId/Path Param




const DeleteBlogbypathparam = async function (req, res) {

    try {

        let id = req.params.blogId;
        let BlogId = await BlogModel.findById({ _id: id });



        let BlogDoc = await BlogModel.findOne({ _id: BlogId, isDeleted: false })
        if (!BlogDoc) {
            return res.status(404).send({ status: false, msg: "Blog does not exist" })
        }

        let deleteblog = await BlogModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true, deletedAt: Date(), isPublished: false } }, { new: true })
        res.status(201).send({ status: true, sent: deleteblog, msg: "Blog Deleted" })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}








//////////////////////DeleteBlog/QueryParam



const DeleteBlogbyqueryparam = async function (req, res) {

    try {

        let { ...data } = req.query;
        console.log(data)
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Error!, Details are needed to delete a blog" });
        let deletedBlog = await BlogModel.updateMany(
            { $and: [{ $and: [{ isDeleted: false }, { isPublished: false }] }, { $or: [{ author_id: data.author_id }, { category: { $in: [data.category] } }, { tags: { $in: [data.tags] } }, { subcategory: { $in: [data.subcategory] } }] }] },
            { $set: { isDeleted: true, deletedAt: new Date(), isPublished: false } },
            { new: true },
        )
        if (deletedBlog.modifiedCount == 0) return res.status(400).send({ status: false, msg: "No such blog exist or might have already been deleted" })

        res.status(200).send({ status: true, msg: "The blog has been deleted successfully" });
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    
}
}



module.exports.CreateBlog = CreateBlog
module.exports.getBlog = getBlog
module.exports.UpdateBlog = UpdateBlog
// <<<<<<< HEAD
// module.exports.DeleteBlogID = DeleteBlogID
// module.exports.DeleteBlog = DeleteBlog
// =======
module.exports.DeleteBlogbyqueryparam = DeleteBlogbyqueryparam
module.exports.DeleteBlogbypathparam = DeleteBlogbypathparam
// >>>>>>> 9a18e814b2d625a521c3c707d68896d3d3834af5
