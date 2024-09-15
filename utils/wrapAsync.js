// first method 
// function wrapAsync(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }

//module.exports wrapAsync;


// this will handle the any id issues like any error occur to get the location of the perticular req
module.exports =(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}