

const { find } = require('../models/authorModel');
const authorMode1 = require('../models/authorModel');
const bookModel = require('../models/bookModel');
//  const bookMode1 = require('../models/bookModel')


 const createNewAuthor = async function(req,res){
 const regAuthor =req.body;
 const savedData =await authorMode1.create(regAuthor)
 res.send({msg : savedData})
}

const createNewBook = async function(req,res){
    const reqbook = req.body;
    const saved = await bookModel.create(reqbook)
    res.send({msg:saved})
}

const allBooks = async function(req,res){
    const authorDetails = await authorMode1.find ({author_name: "Chetan Bhagat"})
    const id = authorDetails[0].author_id
    const booksName = await bookModel.find({author_id: id}).select({name:1})
    res.send({msg:booksName})
    
}
const getBooks = async function(req,res){
    let allbook = await authorMode1.find()
    res.send({msg:allbook})
    
}


const updatedBookPrice = async function(req,res){
const bookDetails = await bookModel.find({name:'Two states'})
const id = bookDetails[0].author_id
const authorN = await authorMode1.find({author_id:id}).select({author_name:1,_id:0})
const bKName =bookDetails[0].name
const updatedPrice = await bookModel.findOneAndUpdate({name:bKName}, {price:100},{new:true}).select({price:1,_id:0})
res.send({msg:authorN,updatedPrice})
}

const authorsName = async function(req,res){
    const booksId = await bookModel.find({price:{$gte:50,$lte:100}}).select({author_id:1,_id:0})
    const id = books.Id.map(inp => inp.author_id)
    let temp =[]
    for(let i=0;i<id.length;i++){
        let x =id[i]
        const author = await authorMode1.find({author_id:x}).select({author_name:1,_id:0})
        temp.push(author)
    }
    const authorName = temp.flat()
    res.send({msg:authorName})
}


module.exports.createNewAuthor = createNewAuthor
module.exports.createNewBook = createNewBook
module.exports.allBooks = allBooks
module.exports.updatedBookPrice = updatedBookPrice
module.exports.authorsName = authorsName
module.exports.getBooks = getBooks




