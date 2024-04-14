const mongoose = require('mongoose');
const userModel = require("./schemas/User")
const express = require('express')
const app = express()
// const mongoose = require('mongoose');

const main = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/UserDB")

}

// const user = new userModel({

//     name: "John Doe",
//     age: 30,
//     email: "johndoe@example.com",
//     address: "123 Main Street",
//     city: "New York",
//     country: "USA",
//     phoneNo: 1234567890

// })
main().then(async() => {
    console.log("DB Connected")

    /* CREATING DOCUMENT */
    // const User = await userModel.create({
    //     name: "Priya",
    //     age: 20,
    //     email: "priyaGanesh@gmail.com",
    //     address:{
    //         street: "13, x Street",
    //         city: "Dallas",
    //         state:"Washington",
    //         country:"United States",
    //         pincode: "212312312"
    //     },
    //     hobbies: ["Listening Music", "Dancing"],
        
    // })
// User.createdDate =new Date(2099,10,11)


 

 /* UPDATING DOCUMENT(The schema validations and rules are only applicable we use to create 
                        an document with create() or save() and not applicable in find,update, 
                        findAndUpdate,delete, so to make the validation and rules to considered
                        we are using {runValidators: true} ) */

// const User = await userModel.updateOne({name:"Priya"},{$set:{email:"qweruiopiemdi@*&*&*&*&.com"}},{runValidators: true})
// const User = await userModel.updateOne({name:"Priya"},{$set:{age:1000}},{runValidators: true})
const User = await userModel.findOneAndUpdate({name:"Priya"},{$set:{hobbies: ["Singing", "Playing"]}},{ new: true })

/* QUERYING DOCUMENT */
// const User = await userModel.find()
//    const User = await userModel.where("name")
//                                 .equals("John")
//                                 .where("age")
//                                 .gte(18)
//                                 .limit(2)
//                                 .populate("bestFriend") //this is used to populate whole child's object
                    
    // User[0].bestFriend ="661aa4a3f6975e4db9e0f126"
    // await User[0].save()

    // const User = await userModel.findByName("JOHN")
    // const User = await userModel.findOne({name:"John"})

    console.log("User Created",User)
    console.log("NamedEmail: ",User.namedEmail)

}).catch((err) => console.error("Error: ", err.message));



// user.save() // collection name created as 'user'
//     .then((result) => {
//         console.log("User saved", result)
//     }).catch((err) => {
//         console.log("Error while creating",err)
//     });