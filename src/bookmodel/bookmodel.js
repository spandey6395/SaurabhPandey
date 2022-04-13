const mongoose = require('mongoose');
// const { required } = require('nodemon/lib/config');
const bookSchema = new mongoose.Schema({
//  bookName: String,
//  authorName: String,
// category: String, 
//  publishedyear: Number

// },{timestamps: true });  


bookName: {
    type: String,
    required: true
},
authorName: String,
pages : Number,
tags: [String],
stockAvailable: Boolean,
year :{
    type: Number,
    default: 2021
},
prices: { indianPrice: Number, europePrice: Number }

}, { timestamps: true });


module.exports = mongoose.model('Book', bookSchema) 
