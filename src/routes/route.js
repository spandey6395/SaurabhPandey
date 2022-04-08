const { response } = require('express');
const express = require('express');
const logger = require('./logger')

const router = express.Router();

router.get('/test-me', function (req, res) {
    console.log('------------------')
    console.log(req)
    console.log('------------------')
    console.log('These are the request query parameters: ', req.query)
    res.send('My first ever api!')
});

//'...............................................................
//Problem 1
router.get('/movies', function(req,res){
    let arr = ['Race','Krish','Don','Hero']
    res.send(arr)
});
                        

//                          Problem 2 & 3

router.get('/movies/:indexNumber' , function(req,res){
    let movies = ['Race','Krish','Don','Hero']
    let arr = []
    if(req.params.indexNumber<(movies.length))
    for(let i=0;i<4;i++)
    {
        if(i==req.params.indexNumber)
        {
            arr[0]=movies[i]
        }
    }
    else{
        res.send('Invalid no you are entered')
    }
    res.send(arr)
})

                            //Problem 4

         router.get('/films' , function(req,res){
             let arr =
             [ {
                'id': 1,
                'name': 'The Shining'
               }, {
                'id': 2,
                'name': 'Incendies'
               }, {
                'id': 3,
                'name': 'Rang de Basanti'
               }, {
                'id': 4,
                'name': 'Finding Nemo'
               }]

               res.send(arr)
               
         })


                    //Problems 5

          router.get('/films/:filmId' , function(req,res){

          let arr =   [ {
            'id': 1,
            'name': 'The Shining'
           }, {
            'id': 2,
            'name': 'Incendies'
           }, {
            'id': 3,
            'name': 'Rang de Basanti'
           }, {
            'id': 4,
            'name': 'Finding Nemo'
           }]

         if(req.params.filmId<arr.length)
         {
             for(i=0;i<arr.length;i++)
             {
               
                if(arr[i].id==req.params.filmId)
                {
                    res.send(arr[i])
                }
            

             }
         }else
         {
             res.send('No movie exists with this id')
                
         }
          })


        module.exports = router;
        // adding this comment for no reason


                        












