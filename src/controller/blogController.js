const BlogModel = require('../module/blogModel')
const AuthorModel = require("../module/authorModel")
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


//.............................................PHASE (1) Create Blogs........................................................


const createBlogs = async function (req, res) {   //create the Blog
    try {

        //TITLE FORMAT CHECK BY REJEX
        const validatefield = (Feild) => {
            return String(Feild)
                .match(
                    /^[a-zA-Z]/
                );
        };

        const data = req.body
        let token = req.headers["x-api-key"] || req.headers["x-Api-Key"];
        if (Object.keys(data).length == 0) {
            return res.status(400).send({status:false, msg: "Blog details not given" })//details is given or not
        }
        if (!data.title) {
            return res.status(400).send({status:false,msg: "Title not given" })
        }
        if (!validatefield(data.title)) {
            return res.status(400).send({ status: false, msg: "Invaild title Format" })//title validation By Rejex
        }


        if (!data.body)
            return res.status(400).send({status:false, msg: "Body not given" })

        if (!validatefield(data.body)) {
            return res.status(400).send({ status: false, msg: "Invaild Body Format" })//BODY validation By Rejex
            }
        if (!data.authorId)
            return res.status(400).send({status:false, msg: "authorId not given" })
        if (!data.category)
            return res.status(400).send({status:false, msg: "category not given" })

        if (!validatefield(data.category)) {
            return res.status(400).send({ status: false, msg: "Invaild Category Format" })//BODY validation By Rejex
            }

        if (!validatefield(data.category)) {
                return res.status(400).send({ status: false, msg: "Invaild Category" })//title validation By Rejex
            }

            if(data.isPublished==true)
            {
                data.publishedAt=new Date()
            }

            if(data.tags){
                const t=data.tags.filter((e)=>e.length!=0)
                data.tags=t
            }
            if(data.subcategory){
                const t=data.subcategory.filter((e)=>e.length!=0)
                data.subcategory=t
            }

        //check the format of the Email id if wrong then give message
        let isValidauthorID = mongoose.Types.ObjectId.isValid(data.authorId);
        if (!isValidauthorID) {
            return res.status(400).send({ status: false, msg: "Author Id is Not Valid" });
        }

        const id = await AuthorModel.findById(data.authorId)
        if (!id)
            return res.status(404).send({status: false,msg: "authorId not found" })

        const reEntry = await BlogModel.findOne({ title: data.title, authorId: data.authorId })
        if (reEntry) {
            return res.status(400).send({ status:false,msg: `you have a blog of title ${data.title}` })
        }
        let decodedtoken = jwt.verify(token, "group11");
        if (decodedtoken.authorId!=req.body.authorId)  {
            return res.status(401).send({ status: false, msg: "You are Not Authorized To create This Blog With This Author Id" });
          }
        const blog = await BlogModel.create(data)
        return res.status(201).send({ status:true,msg: blog })
    }
    catch (err) {
        res.status(500).send({status:false, error: err.message })
    }

}

//.............................................PHASE (1) GET BLOGS........................................................


const getBlogs = async function (req, res) {  //get blog using filter query params
    try {
        const authorId = req.query.authorId;
        const category = req.query.category;
        const tags = req.query.tags;
        const subcategory = req.query.subcategory;
        const obj = {
            isDeleted: false,
            isPublished: true,

        };
        if (category)
            obj.category = category;
        if (authorId)
            obj.authorId = authorId;
        if (tags)
            obj.tags = tags;
        if (subcategory)
            obj.subcategory = subcategory;

        if (obj.authorId) {
            let isValidauthorID = mongoose.Types.ObjectId.isValid(obj.authorId);//check if objectId is objectid
            if (!isValidauthorID) {
                return res.status(400).send({ status: false, msg: "Author Id is Not Valid" });
            }

            const id = await AuthorModel.findById(obj.authorId)//check id exist in author model
            if (!id)
                return res.status(404).send({ status:false,msg: "authorId dont exist" })
        }

        const data = await BlogModel.find(obj);
        if (data.length == 0) {
            return res.status(404).send({ status: false, msg: "Blogs not found" });
        }
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};


//.............................................PHASE (1) Update Blogs........................................................


const updateBlog = async (req, res) => { //update blog
    try {
        const blogId = req.params.blogId

        const blog = await BlogModel.findOne({ _id: blogId, isDeleted: false }) //blog will contain only 1 doc
        //beacuse blog id is unique
        if(!blog){
            return res.status(404).send({status:false,msg:"Blog dont exist"})
        }


        if (blog.isPublished== true) {
            return res.status(404).send({ status:false,msg: "blog already published" })
        }

        if (req.body.title) {
            blog.title = req.body.title
        }
        if (req.body.body) {
            blog.body = req.body.body
        }
        if (req.body.tags) {
            let temp1 = blog.tags
            temp1.push(req.body.tags) //adding tags
            blog.tags = temp1
        }
        if (req.body.subcategory) {
            let temp2 = blog.subcategory
            temp2.push(req.body.subcategory)//adding subcategory
            blog.subcategory = temp2
        }

        blog.publishedAt = new Date()
        blog.isPublished = true
        blog.save()
        console.log(blog)
        res.status(200).send({status:true, msg: blog })

    }
    catch (err) {
        res.status(500).send({status:false, error: err.message })
    }
}

//.............................................PHASE (1) Delete blogs........................................................


const deleteBlog = async (req, res) => {
    try {

        const blog = await BlogModel.findById(req.params.blogId)

        if (blog.isDeleted == false) {
            blog.isDeleted = true
            blog.deletedAt = new Date()
            blog.save()
            return res.status(200).send({ status:true,msg:"Blog deleted Succesfully",data: blog })
        }

        return res.status(404).send({status:false, msg: "Don't Exist" })
    }

    catch (err) {
        res.status(500).send({status:false, error: err.message })
    }


}


//.............................................PHASE (1) Delete Blogs By params........................................................



const deleteParams = async (req, res) => {
    try {

        let token = req.headers['x-api-key'] || req.headers['x-Api-Key']


        let decodedtoken = jwt.verify(token, "group11")


        if(!req.query.authorId && !req.query.category && !req.query.tags && !req.query.subcategory){
            return res.status(400).send({status:false,msg:"qurey param not given"})
        }
        const obj = {}     //obj is condition for find

        if (req.query.authorId) {
            if (req.query.authorId != decodedtoken.authorId) {
                return res.status(403).send({ status:false,msg: "unauthorized access" })
            }
            // obj.authorId = req.query.authorId
        }
        if (req.query.category) {
            obj.category = req.query.category
        }
        if (req.query.tags) {
            obj.tags = req.query.tags
        }
        if (req.query.subcategory) {
            obj.subcategory = req.query.subcategory
        }
        obj.isPublished = false //unpublished
        obj.isDeleted = false //not deleted
        obj.authorId = decodedtoken.authorId
        console.log(obj)

        const data = await BlogModel.updateMany(obj, { $set: { isDeleted: true, deletedAt: new Date() } })

        if (data.matchedCount == 0)
            return res.status(404).send({ status: false, msg: "blog not found" })


        res.status(200).send({ status: true, data: "finally deleted Successfull " + data.matchedCount + " documents" })

    }
    catch (err) {
        res.status(500).send({status:false, error: err.message })
    }
}

module.exports = { createBlogs, getBlogs, updateBlog, deleteBlog, deleteParams }





