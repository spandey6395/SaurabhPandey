
const batchModel = require("../models/batchesModel")

const devlopersModel = require("../models/devlopersModel")





const createBatch = async function(req,res) {
    let batch = req.body
    let batchCreated = await batchModel.create(batch)
    res.send({data:batchCreated})
}


const createDevloper = async function(req,res){
    let devloper = req.body
    let devloperCreated =await devlopersModel.create(devloper)
    res.send({data:devloperCreated})
}


const scholarship = async function(req,res){
    let value = await devlopersModel.find({gender:"female",percentage:{$gte:70}})
    res.send({data:value})
}


const getdevloper = async function(req,res){
    let getprogram =req.query.program
    let getpercentage =req.query.percentage
    let findbatchid = await batchModel.find({name: getprogram})
    let eligible = await devlopersModel.find({batch: findbatchid,percentage:{$gte: getpercentage}})
    res.send({data: eligible})
}


module.exports.scholarship = scholarship
module.exports.createBatch = createBatch
module.exports.createDevloper = createDevloper
module.exports.getdevloper = getdevloper