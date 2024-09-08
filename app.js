const express=require('express');
const mongoose=require('mongoose');
const Listing = require('./modules/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

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
app.get("/listings", async(req,res)=>{
    const allListings= await Listing.find({});
    res.render('listings/index',{allListings});
})

// here was an error created if we put the new downward of the id then route consider new as a id
// New post Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
})

// show route
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    let listing=await Listing.findById(id);
    res.render('listings/show.ejs',{listing});
})

// add new listing 
app.post("/listings", async (req,res)=>{
    // const {title,description,image,price,location,country}=req.body;  this is the first way
    const listing = req.body.listing;
    const newlisting= new Listing(listing);
    newlisting.save();
    res.redirect('/listings');
})


// edit route
app.get("/listings/:id/edit", async (req,res)=>{
    let {id}= req.params;
    let listing =await Listing.findById(id);
    res.render('listings/edit',{listing});
})

// Update route
app.put("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    let newlisting=req.body.listing;
    console.log(newlisting);
    await Listing.findByIdAndUpdate(id,{...newlisting}); // here to update require ...
    res.redirect(`/listings/${id}`);
})

// Delete Route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
})

app.get("/",(req,res)=>{
    res.send("server is working...");
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