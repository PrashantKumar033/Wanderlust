const express=require('express');
const mongoose=require('mongoose');
const Listing = require('./modules/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync =require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema} = require('./schema.js');


const app=express();
const port=8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(express.urlencoded({extended:true}));   // this is for the extract data from url
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);   // this is used to remove the similler layout
app.use(express.static(path.join(__dirname, '/public')));

main().then((res)=>{
    console.log("DB connected sucessfully")
}).catch((err )=> console.log(err));


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


// index Route
app.get("/listings", wrapAsync(async(req,res)=>{
    const allListings= await Listing.find({});
    res.render('listings/index',{allListings});
}));

// here was an error created if we put the new downward of the id then route consider new as a id
// New post Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
})

// show route
app.get("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing=await Listing.findById(id);
    res.render('listings/show.ejs',{listing});
}))


// validate Listings
// this will check the our storage the data should be the save properly not any type error or value
const validateListings=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// add new listing 
app.post("/listings",validateListings, wrapAsync(async (req,res,next)=>{
    // const {title,description,image,price,location,country}=req.body;  this is the first way
    // here we are using the wrapAsync in place of the try and catch
    // if(!res.body.listing){
    //     throw new ExpressError(400,"Bad request!, listing is not found");
    // }  
    // we making the Joi for the check schema conditions
    
    const listing = req.body.listing;
    const newlisting= new Listing(listing);
    newlisting.save();
    res.redirect('/listings');
}));


// edit route
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let listing =await Listing.findById(id);
    res.render('listings/edit',{listing});
}))

// Update route
app.put("/listings/:id", validateListings,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let newlisting=req.body.listing;
    console.log(newlisting);
    await Listing.findByIdAndUpdate(id,{...newlisting}); // here to update require ...
    res.redirect(`/listings/${id}`);
}))

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}))

app.get("/",(req,res)=>{
    res.redirect('/listings');
})


// middlewares
app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong!"} = err;
    res.status(statusCode).render('error.ejs',{statusCode,message});
    // res.status(statusCode).send(message);
})

app.listen(port,()=>{
    console.log(`port working on ${port}`);
})









// this is only for the checking the data save in the db

// // just for checking the data inserting in db or not
// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title: "my new villa",
//         description:"By the beach",
//         price:3000,
//         location:"saket delhi",
//         country:"india",
//     })
//     let saveData= await sampleListing.save();
//     console.log(saveData);
// })