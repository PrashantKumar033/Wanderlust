const mongoose =require('mongoose')
const initData =require('./data');
const Listing = require('../modules/listing');

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB sucessfully");
}).catch((err)=>{
    console.log(`some error occur ${err}`);
})

async function main() {
    await mongoose.connect(mongo_url);
}

const initDB = async ()=>{
    await Listing.deleteMany({}); // delete all with no condition
    await Listing.insertMany(initData.data);
    console.log("data initialize sucessfully");
} 

initDB();