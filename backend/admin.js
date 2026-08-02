const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

mongoose
.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

async function createAdmin(){

    try{
 
        const admin=await User.findOne({
            email:"admin@edutrack.com"
        });

        if(admin){

            console.log("Admin Already Exists");
            process.exit();

        }

        const hashedPassword=await bcrypt.hash("Admin@123",10);

        await User.create({

            name:"Administrator",

            email:"admin@edutrack.com",

            password:hashedPassword,

            role:"admin"

        });

        console.log("Admin Created Successfully");

        process.exit();

    }

    catch(err){

        console.log(err);

        process.exit();

    }

}

createAdmin();
